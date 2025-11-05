# Stork App - Állat Menhely Platform

## Áttekintés

Az Stork App egy komplex web és mobil alkalmazás, amely menhelyeket, állattulajdonosokat és állatbarátokat köt össze egyetlen platformon.

## Főbb Funkciók

### 1. Menhely管理rendszer
- Menhelyek regisztrációja
- Állatok feltöltése és kezelése
- Örökbefogadási rendszer

### 2. Előfizetési Rendszer
- Patreon-szerű havi előfizetés
- Egyszeri adományok
- Stripe integráció

### 3. Elveszett/Talált Állatok
- Elveszett állatok bejelentése
- Kóbor állatok feltöltése
- AI-alapú képegyeztetés

### 4. AI Képfelismerés
- Elveszett állatok összevetése kóbor/menhelyi állatokkal
- Gépi tanulás alapú képanalízis
- Automatikus értesítések egyezés esetén

### 5. Állategészségügyi Adatbázis
- Állattartási információk
- Egészségügyi tanácsok
- Állatorvos ajánlás rendszer

## Technológiai Stack

### Backend
- **API Server**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Payment**: Stripe

### AI Service
- **Language**: Python
- **Framework**: FastAPI
- **ML Libraries**: TensorFlow/PyTorch
- **Image Processing**: OpenCV
- **Model**: ResNet/EfficientNet fine-tuned

### Frontend (Web)
- **Framework**: React + TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI / Tailwind CSS
- **Build Tool**: Vite

### Mobile App
- **Framework**: React Native + TypeScript
- **Navigation**: React Navigation
- **State**: Redux Toolkit

### DevOps
- **Containerization**: Docker
- **Cloud**: AWS/GCP
- **CI/CD**: GitHub Actions
- **Storage**: AWS S3 (képek)

## Projekt Struktúra

```
storkapp/
├── backend/              # Node.js API szerver
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/          # Database schema
│   └── tests/
│
├── ai-service/          # Python AI mikroszervíz
│   ├── app/
│   │   ├── models/      # ML modellek
│   │   ├── services/    # Képfeldolgozás
│   │   └── api/         # FastAPI endpoints
│   ├── training/        # Model training scripts
│   └── tests/
│
├── frontend/            # React web app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── services/
│   └── public/
│
├── mobile/              # React Native app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   └── store/
│   └── assets/
│
├── shared/              # Megosztott típusok és utils
│   └── types/
│
└── docs/                # Dokumentáció
    ├── api/
    ├── architecture/
    └── user-guides/
```

## Adatbázis Modellek

### Főbb Entitások
- **User**: Felhasználók (tulajdonosok, menhelyek, adminok)
- **Shelter**: Menhelyek
- **Animal**: Állatok (menhelyi/örökbefogadható)
- **LostPet**: Elveszett állatok
- **FoundPet**: Talált kóbor állatok
- **Match**: AI által talált egyezések
- **Subscription**: Előfizetések
- **Donation**: Egyszeri adományok
- **HealthInfo**: Állategészségügyi információk
- **Veterinarian**: Állatorvosok

## Fejlesztési Fázisok

### Fázis 1: Alapok (MVP)
- [x] Projekt inicializálás
- [ ] Backend API alapok
- [ ] Adatbázis schema
- [ ] Autentikáció
- [ ] Alapvető CRUD műveletek

### Fázis 2: Core Features
- [ ] Menhely regisztráció és kezelés
- [ ] Állat feltöltés és kezelés
- [ ] Elveszett/talált állatok modul
- [ ] Frontend alapok

### Fázis 3: AI Integráció
- [ ] AI service felállítása
- [ ] Képfeltöltés és tárolás
- [ ] Képfelismerő model training
- [ ] Matching algoritmus

### Fázis 4: Payment & Subscriptions
- [ ] Stripe integráció
- [ ] Előfizetési rendszer
- [ ] Adományozási rendszer

### Fázis 5: Mobile & Polish
- [ ] React Native app
- [ ] Push notifications
- [ ] Optimalizálás
- [ ] Testing

## Telepítés

```bash
# Backend
cd backend
npm install
npm run dev

# AI Service
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Mobile
cd mobile
npm install
npm run android  # vagy npm run ios
```

## Környezeti Változók

Szükséges `.env` fájlok minden modulban - lásd `.env.example` fájlokat.

## License

Tulajdonjog meghatározandó

## Kapcsolat

Projekt repository: https://github.com/TheGoldMany/storkapp
