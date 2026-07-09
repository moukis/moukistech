#!/usr/bin/env python3
"""
Moukis tech — Standalone database seed script (Database part).

Seeds a MongoDB (Atlas or local) instance with:
  - The required indexes (users.email unique, blog_posts.slug unique)
  - The admin account (from ADMIN_EMAIL / ADMIN_PASSWORD)
  - 3 sample blog posts

NOTE: The backend also auto-seeds this data on its first startup
(see backend/server.py -> seed_admin / seed_blog). Running this script is
OPTIONAL — useful to pre-populate Atlas before deploying, or to reset data.

Usage:
    pip install pymongo bcrypt python-dotenv
    export MONGO_URL="mongodb+srv://..."   # or put it in a .env file
    export DB_NAME="moukis_tech"
    export ADMIN_EMAIL="rewllasy@gmail.com"
    export ADMIN_PASSWORD="YourStrongPassword"
    python seed.py
"""
import os
import re
from datetime import datetime, timezone

import bcrypt
from pymongo import MongoClient, ASCENDING

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text or "article"


def main():
    mongo_url = os.environ["MONGO_URL"]
    db_name = os.environ.get("DB_NAME", "moukis_tech")
    admin_email = os.environ.get("ADMIN_EMAIL", "rewllasy@gmail.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "MoukisTech2025!")

    client = MongoClient(mongo_url)
    db = client[db_name]

    # 1. Indexes
    db.users.create_index([("email", ASCENDING)], unique=True)
    db.blog_posts.create_index([("slug", ASCENDING)], unique=True)
    print("Indexes ensured: users.email (unique), blog_posts.slug (unique)")

    # 2. Admin
    existing = db.users.find_one({"email": admin_email})
    hashed = bcrypt.hashpw(admin_password.encode(), bcrypt.gensalt()).decode()
    if existing is None:
        db.users.insert_one({
            "email": admin_email, "password_hash": hashed,
            "name": "SYLLA Mactar", "role": "admin", "created_at": now_iso(),
        })
        print(f"Admin created: {admin_email}")
    else:
        db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hashed}})
        print(f"Admin already exists — password updated: {admin_email}")

    # 3. Sample blog posts
    if db.blog_posts.count_documents({}) == 0:
        samples = [
            {"title": "5 signes que votre ordinateur portable a besoin d'un nouveau SSD",
             "excerpt": "Lenteur au démarrage, plantages, bruits inhabituels… Voici comment savoir s'il est temps de passer au SSD.",
             "content": "Un disque SSD transforme radicalement les performances de votre ordinateur.\n\nSi votre machine met plus d'une minute à démarrer, si les applications se figent ou si vous entendez des cliquetis provenant du disque dur, il est probablement temps de passer à un SSD.\n\nUn SSD moderne offre des vitesses de lecture jusqu'à 10 fois supérieures à un disque dur traditionnel.",
             "cover_image": "https://images.pexels.com/photos/6636474/pexels-photo-6636474.jpeg",
             "tags": ["SSD", "Performance"]},
            {"title": "Comment prolonger la durée de vie de votre batterie",
             "excerpt": "Des gestes simples pour préserver la santé de votre batterie et éviter un remplacement prématuré.",
             "content": "La batterie est l'un des composants les plus sollicités d'un ordinateur portable.\n\nÉvitez de laisser votre appareil branché en permanence à 100%, maintenez idéalement la charge entre 20% et 80%, et éloignez-le des sources de chaleur.",
             "cover_image": "https://images.pexels.com/photos/9242178/pexels-photo-9242178.jpeg",
             "tags": ["Batterie", "Conseils"]},
            {"title": "Écran cassé : réparer ou remplacer ?",
             "excerpt": "Fissures, pixels morts, rétroéclairage défaillant : nos conseils pour prendre la bonne décision.",
             "content": "Un écran endommagé ne signifie pas forcément la fin de votre ordinateur.\n\nDans la majorité des cas, seule la dalle est à remplacer, une opération rapide et économique.",
             "cover_image": "https://images.pexels.com/photos/7639374/pexels-photo-7639374.jpeg",
             "tags": ["Écran", "Réparation"]},
        ]
        ts = now_iso()
        for s in samples:
            s.update({"slug": slugify(s["title"]), "published": True, "created_at": ts, "updated_at": ts})
        db.blog_posts.insert_many(samples)
        print(f"Inserted {len(samples)} sample blog posts")
    else:
        print("Blog posts already present — skipping sample insert")

    client.close()
    print("Done.")


if __name__ == "__main__":
    main()
