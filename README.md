# Provena Project

**Full-stack application with Django backend and Quasar frontend**

## 📁 Repository Structure

```
provena/
├── backend/              # Django REST API + PostgreSQL
├── quasar-provena/       # Quasar Vue.js Frontend
├── docker-compose.yml    # Docker orchestration
├── .env                  # Environment variables
└── DOCKER_SETUP.md       # Docker documentation
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Python 3.11+ (for local development)
- Node.js & pnpm (for frontend development)

### Development with Docker

```bash
# Start both backend and frontend
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:9000
```

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Django Admin | `http://localhost:8000/admin/` | EssuAdmin |
| API Docs | `http://localhost:8000/api/` | N/A |
| Frontend | `http://localhost:9000` | N/A |
| pgAdmin | Desktop App | postgres / Decar#10 |

## 🗄️ Database

**PostgreSQL 16**
- **Port:** 5433 (external), 5432 (internal)
- **Database:** provena_db
- **User:** postgres
- **Password:** Decar#10 (configured in `.env`)

## 📝 Environment Setup

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## 🛠️ Common Commands

### Backend

```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Run migrations
docker-compose exec backend python manage.py migrate

# Access shell
docker-compose exec backend python manage.py shell
```

### Frontend

```bash
# Install dependencies
cd quasar-provena
pnpm install

# Development server
pnpm dev
```

## 📦 Tech Stack

**Backend:**
- Django 5.0.6
- Django REST Framework 3.14.0
- PostgreSQL 16
- Gunicorn

**Frontend:**
- Vue 3
- Quasar Framework
- Vite

## 📄 License

MIT

## 👤 Author
<<<<<<< HEAD

Decar Sanchez
Joy Tiopez
Recardo Omlang
=======
 Decar Sanchez
 Joy Tiopez
 Recardo Omlang
>>>>>>> 5a9e6f4446c4aacb4ad26f574876a90017eb8f52
