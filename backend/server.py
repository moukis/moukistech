from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

PyObjectId = Annotated[str, BeforeValidator(str)]


def now_utc():
    return datetime.now(timezone.utc)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text or "article"


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": now_utc() + timedelta(days=7), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request,
                           creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    token = None
    if creds:
        token = creds.credentials
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Type de jeton invalide")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Jeton expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Jeton invalide")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    phone: Optional[str] = ""
    service: Optional[str] = ""
    message: str = Field(..., min_length=5)


class Contact(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: PyObjectId = Field(alias="_id")
    name: str
    email: str
    phone: str = ""
    service: str = ""
    message: str
    is_read: bool = False
    created_at: str


class BlogCreate(BaseModel):
    title: str = Field(..., min_length=2)
    excerpt: str = ""
    content: str = Field(..., min_length=5)
    cover_image: str = ""
    tags: List[str] = []
    published: bool = True


class BlogPost(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: PyObjectId = Field(alias="_id")
    title: str
    slug: str
    excerpt: str = ""
    content: str
    cover_image: str = ""
    tags: List[str] = []
    published: bool = True
    created_at: str
    updated_at: str


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@api_router.post("/auth/login")
async def login(data: LoginInput):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    token = create_access_token(str(user["_id"]), email)
    return {"access_token": token, "token_type": "bearer",
            "user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def me(current=Depends(get_current_user)):
    return {"email": current["email"], "name": current.get("name", "Admin"), "role": current.get("role", "admin")}


# ---------------------------------------------------------------------------
# Contact routes
# ---------------------------------------------------------------------------
@api_router.post("/contact", status_code=201)
async def create_contact(data: ContactCreate):
    doc = data.model_dump()
    doc.update({"is_read": False, "created_at": now_utc().isoformat()})
    res = await db.contacts.insert_one(doc)
    return {"success": True, "id": str(res.inserted_id)}


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(current=Depends(get_current_user)):
    docs = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return [Contact(**{**d, "_id": str(d["_id"])}) for d in docs]


@api_router.patch("/contact/{contact_id}/read")
async def mark_read(contact_id: str, current=Depends(get_current_user)):
    await db.contacts.update_one({"_id": ObjectId(contact_id)}, {"$set": {"is_read": True}})
    return {"success": True}


@api_router.delete("/contact/{contact_id}")
async def delete_contact(contact_id: str, current=Depends(get_current_user)):
    await db.contacts.delete_one({"_id": ObjectId(contact_id)})
    return {"success": True}


# ---------------------------------------------------------------------------
# Blog routes
# ---------------------------------------------------------------------------
@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog(published_only: bool = True):
    query = {"published": True} if published_only else {}
    docs = await db.blog_posts.find(query).sort("created_at", -1).to_list(1000)
    return [BlogPost(**{**d, "_id": str(d["_id"])}) for d in docs]


@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Article introuvable")
    return BlogPost(**{**doc, "_id": str(doc["_id"])})


async def _unique_slug(base: str, exclude_id: Optional[str] = None) -> str:
    slug = base
    i = 1
    while True:
        existing = await db.blog_posts.find_one({"slug": slug})
        if not existing or (exclude_id and str(existing["_id"]) == exclude_id):
            return slug
        i += 1
        slug = f"{base}-{i}"


@api_router.post("/blog", response_model=BlogPost, status_code=201)
async def create_blog(data: BlogCreate, current=Depends(get_current_user)):
    slug = await _unique_slug(slugify(data.title))
    ts = now_utc().isoformat()
    doc = data.model_dump()
    doc.update({"slug": slug, "created_at": ts, "updated_at": ts})
    res = await db.blog_posts.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return BlogPost(**doc)


@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog(post_id: str, data: BlogCreate, current=Depends(get_current_user)):
    existing = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Article introuvable")
    slug = existing["slug"]
    if slugify(data.title) != slugify(existing["title"]):
        slug = await _unique_slug(slugify(data.title), exclude_id=post_id)
    update = data.model_dump()
    update.update({"slug": slug, "updated_at": now_utc().isoformat()})
    await db.blog_posts.update_one({"_id": ObjectId(post_id)}, {"$set": update})
    doc = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    return BlogPost(**{**doc, "_id": str(doc["_id"])})


@api_router.delete("/blog/{post_id}")
async def delete_blog(post_id: str, current=Depends(get_current_user)):
    await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    return {"success": True}


@api_router.get("/")
async def root():
    return {"message": "Moukis tech API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
async def seed_admin():
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": hash_password(admin_password),
            "name": "SYLLA Mactar", "role": "admin", "created_at": now_utc().isoformat()})
        logger.info("Admin seeded")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")


async def seed_blog():
    if await db.blog_posts.count_documents({}) > 0:
        return
    samples = [
        {"title": "5 signes que votre ordinateur portable a besoin d'un nouveau SSD",
         "excerpt": "Lenteur au démarrage, plantages, bruits inhabituels… Voici comment savoir s'il est temps de passer au SSD.",
         "content": "Un disque SSD transforme radicalement les performances de votre ordinateur.\n\nSi votre machine met plus d'une minute à démarrer, si les applications se figent ou si vous entendez des cliquetis provenant du disque dur, il est probablement temps de passer à un SSD.\n\nUn SSD moderne offre des vitesses de lecture jusqu'à 10 fois supérieures à un disque dur traditionnel, réduisant le temps de démarrage à quelques secondes. Chez Moukis tech, nous réalisons le clonage complet de vos données pour une migration sans perte.",
         "cover_image": "https://images.pexels.com/photos/6636474/pexels-photo-6636474.jpeg",
         "tags": ["SSD", "Performance"]},
        {"title": "Comment prolonger la durée de vie de votre batterie",
         "excerpt": "Des gestes simples pour préserver la santé de votre batterie et éviter un remplacement prématuré.",
         "content": "La batterie est l'un des composants les plus sollicités d'un ordinateur portable.\n\nÉvitez de laisser votre appareil branché en permanence à 100%, maintenez idéalement la charge entre 20% et 80%, et éloignez-le des sources de chaleur.\n\nSi votre autonomie a chuté drastiquement, un diagnostic professionnel permet de mesurer la capacité réelle de la batterie et de déterminer si un remplacement est nécessaire.",
         "cover_image": "https://images.pexels.com/photos/9242178/pexels-photo-9242178.jpeg",
         "tags": ["Batterie", "Conseils"]},
        {"title": "Écran cassé : réparer ou remplacer ?",
         "excerpt": "Fissures, pixels morts, rétroéclairage défaillant : nos conseils pour prendre la bonne décision.",
         "content": "Un écran endommagé ne signifie pas forcément la fin de votre ordinateur.\n\nDans la majorité des cas, seule la dalle est à remplacer, une opération rapide et économique. Nous utilisons uniquement des dalles de qualité d'origine ou équivalentes.\n\nContactez-nous pour un devis gratuit et transparent avant toute intervention.",
         "cover_image": "https://images.pexels.com/photos/7639374/pexels-photo-7639374.jpeg",
         "tags": ["Écran", "Réparation"]},
    ]
    ts = now_utc().isoformat()
    for s in samples:
        s.update({"slug": await _unique_slug(slugify(s["title"])),
                  "published": True, "created_at": ts, "updated_at": ts})
    await db.blog_posts.insert_many(samples)
    logger.info("Blog seeded")


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await seed_admin()
    await seed_blog()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
