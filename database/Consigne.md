# Database — Moukis tech (Part 3 of 3)

This project uses **MongoDB** (hosted on **MongoDB Atlas** in production). There is no separate
database server code — the FastAPI backend talks directly to MongoDB via the `MONGO_URL`
connection string. This folder documents the data model and provides an optional seed script.

> The backend **auto-seeds** the admin account, indexes, and sample blog posts on its first
> startup (see `backend/server.py`). Running `seed.py` manually is optional.

---

## Collections

### `users`
Stores admin accounts.
| Field           | Type   | Notes                                   |
|-----------------|--------|-----------------------------------------|
| `_id`           | ObjectId | Primary key                           |
| `email`         | string | **Unique index**, stored lowercase      |
| `password_hash` | string | bcrypt hash (starts with `$2b$`)        |
| `name`          | string | Display name                            |
| `role`          | string | `"admin"`                               |
| `created_at`    | string | ISO 8601 timestamp                      |

### `blog_posts`
Blog articles (managed from the admin panel).
| Field         | Type    | Notes                                 |
|---------------|---------|---------------------------------------|
| `_id`         | ObjectId| Primary key                           |
| `title`       | string  |                                       |
| `slug`        | string  | **Unique index**, auto-generated      |
| `excerpt`     | string  | Short summary                         |
| `content`     | string  | Body (newline-separated paragraphs)   |
| `cover_image` | string  | Image URL                             |
| `tags`        | array   | List of strings                       |
| `published`   | boolean | Draft vs published                    |
| `created_at`  | string  | ISO 8601                              |
| `updated_at`  | string  | ISO 8601                              |

### `contacts`
Contact / booking form submissions.
| Field        | Type    | Notes                        |
|--------------|---------|------------------------------|
| `_id`        | ObjectId| Primary key                  |
| `name`       | string  |                              |
| `email`      | string  |                              |
| `phone`      | string  | Optional                     |
| `service`    | string  | Optional (selected service)  |
| `message`    | string  |                              |
| `is_read`    | boolean | Admin read flag              |
| `created_at` | string  | ISO 8601                     |

---

## Indexes
```
db.users.createIndex({ email: 1 }, { unique: true })
db.blog_posts.createIndex({ slug: 1 }, { unique: true })
```

---

## Optional: run the seed script

```bash
pip install pymongo bcrypt python-dotenv

export MONGO_URL="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
export DB_NAME="moukis_tech"
export ADMIN_EMAIL="rewllasy@gmail.com"
export ADMIN_PASSWORD="YourStrongPassword"

python seed.py
```

This ensures indexes, creates/updates the admin account, and inserts 3 sample blog posts
(only if the collection is empty).

See the root **`DEPLOYMENT_GUIDE.md`** for full MongoDB Atlas setup instructions.
