# Stork App - Telepítési Útmutató

Ez a dokumentum végigvezet a Stork App helyi fejlesztői környezetének beállításán.

## Előfeltételek

Győződj meg róla, hogy a következő szoftverek telepítve vannak:

- **Node.js** (v18 vagy újabb) - [https://nodejs.org](https://nodejs.org)
- **Python** (v3.11 vagy újabb) - [https://python.org](https://python.org)
- **PostgreSQL** (v14 vagy újabb) - [https://postgresql.org](https://postgresql.org)
- **Docker & Docker Compose** (opcionális, de ajánlott) - [https://docker.com](https://docker.com)

## Gyors Indítás Docker Compose-zal

A legegyszerűbb módja a projekt elindításának a Docker Compose használata:

```bash
# 1. Klónozd le a repository-t
git clone https://github.com/TheGoldMany/storkapp.git
cd storkapp

# 2. Indítsd el az összes szolgáltatást
docker-compose up
```

Ez elindítja:
- PostgreSQL adatbázist a `5432` porton
- Backend API-t a `3000` porton
- AI szolgáltatást a `8000` porton
- Frontend alkalmazást a `5173` porton

A frontend elérhető lesz: **http://localhost:5173**

## Manuális Telepítés

Ha nem szeretnéd Docker-t használni, manuálisan is telepítheted a szolgáltatásokat:

### 1. Adatbázis Beállítása

```bash
# Hozz létre egy új PostgreSQL adatbázist
createdb storkapp

# Vagy psql-ben:
# CREATE DATABASE storkapp;
```

### 2. Backend Telepítése

```bash
cd backend

# Másold le a .env példafájlt és add meg az értékeket
cp .env.example .env
# Szerkeszd a .env fájlt és add meg:
# - DATABASE_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY (ha kell)
# - AWS kulcsok (ha kell)

# Telepítsd a függőségeket
npm install

# Generáld a Prisma klienst
npx prisma generate

# Futtasd a migrációkat
npx prisma migrate dev

# Indítsd el a fejlesztői szervert
npm run dev
```

A backend elérhető lesz: **http://localhost:3000**

### 3. AI Service Telepítése

```bash
cd ai-service

# Hozz létre Python virtuális környezetet
python -m venv venv

# Aktiváld a virtuális környezetet
# Linux/Mac:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Másold le a .env példafájlt
cp .env.example .env
# Szerkeszd a .env fájlt

# Telepítsd a függőségeket
pip install -r requirements.txt

# Indítsd el a szervert
uvicorn app.main:app --reload --port 8000
```

Az AI service elérhető lesz: **http://localhost:8000**

### 4. Frontend Telepítése

```bash
cd frontend

# Másold le a .env példafájlt
cp .env.example .env
# Ellenőrizd, hogy a VITE_API_URL helyes-e

# Telepítsd a függőségeket
npm install

# Indítsd el a fejlesztői szervert
npm run dev
```

A frontend elérhető lesz: **http://localhost:5173**

## Prisma Studio (Adatbázis Böngésző)

Az adatbázis tartalmának megtekintéséhez használd a Prisma Studio-t:

```bash
cd backend
npx prisma studio
```

Ez megnyit egy böngésző ablakot a `http://localhost:5555` címen.

## API Dokumentáció

A backend API végpontjai:

### Autentikáció
- `POST /api/auth/register` - Regisztráció
- `POST /api/auth/login` - Bejelentkezés
- `GET /api/auth/profile` - Profil lekérése (auth required)
- `PUT /api/auth/profile` - Profil frissítése (auth required)

### Menhelyek
- `GET /api/shelters` - Menhelyek listázása
- `GET /api/shelters/:id` - Menhely részletei
- `POST /api/shelters` - Új menhely létrehozása (auth required)
- `PUT /api/shelters/:id` - Menhely frissítése (auth required)

### Állatok
- `GET /api/animals` - Állatok listázása
- `GET /api/animals/:id` - Állat részletei
- `POST /api/animals` - Új állat hozzáadása (shelter admin required)
- `PUT /api/animals/:id` - Állat frissítése (shelter admin required)

### Elveszett Állatok
- `GET /api/lost-pets` - Elveszett állatok listája
- `GET /api/lost-pets/:id` - Elveszett állat részletei
- `POST /api/lost-pets` - Elveszett állat bejelentése (auth required)

### Talált Állatok
- `GET /api/found-pets` - Talált állatok listája
- `GET /api/found-pets/:id` - Talált állat részletei
- `POST /api/found-pets` - Talált állat bejelentése (auth required)

### Matching (AI)
- `GET /api/matches` - Találatok listája (auth required)
- `GET /api/matches/:id` - Találat részletei
- `PUT /api/matches/:id/verify` - Találat megerősítése
- `PUT /api/matches/:id/dismiss` - Találat elutasítása

### Előfizetések
- `POST /api/subscriptions` - Új előfizetés létrehozása (auth required)
- `GET /api/subscriptions` - Előfizetések listája (auth required)
- `DELETE /api/subscriptions/:id` - Előfizetés lemondása (auth required)

### Adományok
- `POST /api/donations` - Adomány küldése (auth required)
- `GET /api/donations` - Saját adományok listája (auth required)
- `GET /api/donations/shelter/:shelterId` - Menhely adományai

### Egészségügyi Információk
- `GET /api/health-info` - Tanácsok listája
- `GET /api/health-info/:id` - Tanács részletei
- `GET /api/health-info/vets/search` - Állatorvosok keresése

## Környezeti Változók

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/storkapp
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-central-1
AWS_S3_BUCKET=storkapp-images

# AI Service
AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)

```env
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/storkapp
BACKEND_API_URL=http://localhost:3000
CONFIDENCE_THRESHOLD=0.65
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Backend nem indul el
- Ellenőrizd, hogy fut-e a PostgreSQL
- Ellenőrizd a DATABASE_URL-t a .env fájlban
- Futtasd újra: `npx prisma migrate dev`

### AI Service hibák
- Ellenőrizd, hogy aktiválva van-e a Python venv
- Telepítsd újra a függőségeket: `pip install -r requirements.txt`
- PyTorch hibák esetén lásd: [https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/)

### Frontend nem éri el a backend-et
- Ellenőrizd, hogy a backend fut-e a 3000-es porton
- Ellenőrizd a VITE_API_URL-t a frontend .env fájlban
- Nyisd meg a böngésző konzolt a hibák megtekintéséhez

## Következő Lépések

1. **Tesztadatok létrehozása**: Használd a Prisma Studio-t vagy készíts seed scripteket
2. **AI Model training**: Train egy custom modelt az állat képfelismeréshez
3. **AWS S3 Setup**: Állíts be képfeltöltést az S3-ra
4. **Stripe Setup**: Konfiguráld a Stripe fiókot az előfizetésekhez
5. **Mobile App**: Fejleszd ki a React Native appot

## További Dokumentáció

- [README.md](./README.md) - Projekt áttekintés
- [Backend API docs](./backend/README.md) - Részletes API dokumentáció (később)
- [AI Service docs](./ai-service/README.md) - AI model részletek (később)

## Támogatás

Ha problémád van, nyiss egy issue-t a GitHub repository-ban.
