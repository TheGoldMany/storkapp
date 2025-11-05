# Stork App - Rendszerarchitektúra

## Áttekintés

A Stork App egy modern, mikroszervíz-alapú alkalmazás, amely három fő komponensből áll:

1. **Backend API** (Node.js + Express + TypeScript)
2. **AI Service** (Python + FastAPI)
3. **Frontend** (React + TypeScript)

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                    http://localhost:5173                     │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Node.js)                      │
│                    http://localhost:3000                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Routes  │  │ Shelter      │  │ Animal       │      │
│  │              │  │ Routes       │  │ Routes       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Lost/Found   │  │ Subscription │  │ Donation     │      │
│  │ Routes       │  │ Routes       │  │ Routes       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬──────────────────────────┬────────────────────┘
             │                          │
             │ Prisma ORM               │ HTTP
             ▼                          ▼
┌──────────────────────┐   ┌────────────────────────────────┐
│  PostgreSQL Database │   │   AI Service (FastAPI)         │
│  port: 5432          │   │   http://localhost:8000        │
│                      │   │                                │
│  ┌────────────────┐  │   │  ┌──────────────────────────┐ │
│  │ Users          │  │   │  │ Image Matcher            │ │
│  │ Shelters       │  │   │  │ (ResNet50)               │ │
│  │ Animals        │  │   │  └──────────────────────────┘ │
│  │ LostPets       │  │   │  ┌──────────────────────────┐ │
│  │ FoundPets      │  │   │  │ Database Service         │ │
│  │ Matches        │  │◄──┤  │ (asyncpg)                │ │
│  │ Subscriptions  │  │   │  └──────────────────────────┘ │
│  │ Donations      │  │   └────────────────────────────────┘
│  └────────────────┘  │
└──────────────────────┘
         │
         │ Stripe Webhooks
         ▼
┌──────────────────────┐
│   Stripe Payment     │
│   Gateway            │
└──────────────────────┘
```

## Backend API (Node.js)

### Technológiai Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **Payment**: Stripe
- **Logging**: Winston

### Architektúra Pattern

A backend az **MVC (Model-View-Controller)** pattern egy változatát követi:

```
backend/
├── src/
│   ├── controllers/      # Business logic
│   ├── routes/           # Route definitions
│   ├── middleware/       # Auth, error handling
│   ├── services/         # External service integrations
│   └── utils/            # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
└── tests/                # Unit & integration tests
```

### Fő Komponensek

#### Controllers
Minden entitáshoz tartozik egy controller, amely kezeli a business logikát:
- `auth.controller.ts` - Regisztráció, login, profil
- `shelter.controller.ts` - Menhely CRUD műveletek
- `animal.controller.ts` - Állat CRUD műveletek
- `lostPet.controller.ts` - Elveszett állatok kezelése
- `foundPet.controller.ts` - Talált állatok kezelése
- `match.controller.ts` - AI találatok kezelése
- `subscription.controller.ts` - Stripe előfizetések
- `donation.controller.ts` - Adományok kezelése

#### Middleware
- **auth.ts**: JWT token validáció és authorization
- **errorHandler.ts**: Központi error handling

#### Routes
RESTful API végpontok definiálása és validáció.

### Autentikáció & Authorizáció

```typescript
// JWT token generálás
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Middleware védelem
router.get('/protected', authenticate, handler);
router.post('/admin-only', authenticate, authorize('ADMIN'), handler);
```

### Szerepkörök (Roles)

1. **USER** - Normál felhasználó
   - Elveszett/talált állatok bejelentése
   - Adományok küldése
   - Előfizetések kezelése

2. **SHELTER_ADMIN** - Menhely adminisztrátor
   - Menhely kezelése
   - Állatok hozzáadása/szerkesztése
   - Adományok fogadása

3. **VET** - Állatorvos
   - Profil létrehozása
   - Tanácsok megosztása (később)

4. **ADMIN** - Platform adminisztrátor
   - Teljes hozzáférés
   - Menhelyek jóváhagyása
   - Egészségügyi információk kezelése

## AI Service (Python)

### Technológiai Stack

- **Framework**: FastAPI
- **ML Library**: PyTorch
- **Model**: ResNet50 (pre-trained)
- **Image Processing**: OpenCV, Pillow
- **Database Client**: asyncpg

### Architektúra

```
ai-service/
├── app/
│   ├── api/
│   │   ├── match.py       # Matching endpoints
│   │   └── health.py      # Health checks
│   ├── services/
│   │   ├── image_matcher.py   # AI model service
│   │   └── database.py        # DB operations
│   └── main.py            # FastAPI app
├── training/              # Model training scripts (future)
└── models/                # Saved models
```

### Képfelismerési Folyamat

1. **Feature Extraction**
   - ResNet50 model használata
   - Képek konvertálása 224x224-es méretre
   - Feature vector generálás (2048 dimenzió)

2. **Similarity Calculation**
   - Cosine similarity számítás
   - Több kép esetén pairwise comparison
   - Maximum és átlag similarity kombinálása

3. **Matching Logic**
   ```python
   confidence = (max_similarity * 0.6 + avg_similarity * 0.4) * 100

   if confidence > 65:
       create_match()
   ```

### API Endpoints

- `POST /api/match/lost-pet` - Elveszett állat matching
- `POST /api/match/found-pet` - Talált állat matching
- `GET /api/health` - Health check
- `GET /api/match/test` - Service test

### Background Processing

A matching műveletek háttérben futnak, hogy ne blokkolják a response-t:

```python
background_tasks.add_task(
    process_lost_pet_matching,
    lost_pet_id,
    images,
    type,
    city
)
```

## Frontend (React)

### Technológiai Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Forms**: Formik + Yup
- **Payments**: Stripe React

### Architektúra

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── store/
│   │   ├── slices/        # Redux slices
│   │   └── store.ts       # Store configuration
│   ├── services/
│   │   └── api.ts         # API client
│   ├── theme.ts           # MUI theme
│   └── main.tsx           # Entry point
└── public/                # Static assets
```

### State Management

Redux Toolkit slices:
- `authSlice` - Felhasználó autentikáció
- `shelterSlice` - Menhelyek állapota
- `animalSlice` - Állatok állapota

```typescript
// Példa slice használat
const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
dispatch(loginSuccess({ user, token }));
```

### Routing Struktúra

```
/ - HomePage (landing page)
/login - Bejelentkezés
/register - Regisztráció
/shelters - Menhelyek listája
/shelters/:id - Menhely részletei
/animals - Örökbefogadható állatok
/animals/:id - Állat részletei
/lost-pets - Elveszett állatok
/found-pets - Talált állatok
/health-info - Tanácsok
/dashboard - Felhasználói dashboard (protected)
/profile - Profil (protected)
```

### Protected Routes

```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

## Adatbázis Schema

### Főbb Táblák

#### Users
- Alapvető felhasználói információk
- Szerepkörök (role enum)
- Autentikáció adatok

#### Shelters
- Menhely információk
- Kapcsolódik User-hez (one-to-one)
- GPS koordináták támogatása

#### Animals
- Menhelyi állatok
- Képek (array)
- Státusz (AVAILABLE, ADOPTED, stb.)
- Egészségügyi információk

#### LostPets & FoundPets
- Elveszett/talált állatok
- Hely és időpont információk
- Kapcsolattartási adatok

#### Matches
- AI által generált találatok
- Confidence score (0-100)
- Verifikálás/elutasítás státusz

#### Subscriptions
- Stripe integráció
- Tier-ek (BASIC, PREMIUM, SUPPORTER)
- Automatikus megújítás

#### Donations
- Egyszeri adományok
- Opcionális anonimitás
- Stripe payment ID

### Kapcsolatok (Relationships)

```
User ─── 1:1 ───> Shelter
User ─── 1:N ───> LostPets
User ─── 1:N ───> FoundPets
User ─── 1:N ───> Subscriptions
User ─── 1:N ───> Donations

Shelter ─── 1:N ───> Animals
Shelter ─── 1:N ───> Subscriptions
Shelter ─── 1:N ───> Donations

LostPet ─── 1:N ───> Matches
FoundPet ─── 1:N ───> Matches
Animal ─── 1:N ───> Matches
```

## External Integrations

### Stripe Payment

```typescript
// Subscription creation
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',
});
```

### AWS S3 (Future)

Képek tárolása S3-on:
- Feltöltés signed URL-el
- CloudFront CDN használata
- Image optimization (thumbnails)

## Security

### Authentication
- JWT tokens (7 nap lejárat)
- Secure password hashing (bcrypt, salt rounds: 10)
- Token refresh mechanism (future)

### Authorization
- Role-based access control
- Route-level middleware
- Resource ownership checks

### Data Protection
- SQL injection védelem (Prisma ORM)
- XSS védelem (React automatic escaping)
- CSRF tokens (future)
- Rate limiting (future)

### Environment Variables
- Érzékeny adatok .env fájlban
- .gitignore-ban kizárva
- Production secrets management (AWS Secrets Manager)

## Scalability Considerations

### Horizontal Scaling
- Stateless API szerverek
- Load balancer előtt
- Session management Redis-ben (future)

### Database Optimization
- Indexek a gyakori query-ken
- Connection pooling
- Read replicas (future)

### Caching
- Redis cache layer (future)
- CDN static assets-hez
- API response caching

### Async Processing
- AI matching háttérben
- Email notifications queue (future)
- Image processing queue (future)

## Monitoring & Logging

### Logging
- Winston logger backend-ben
- Structured logging
- Log aggregation (CloudWatch/ELK future)

### Metrics
- API response times
- Error rates
- User analytics (future)

### Alerts
- Error notifications
- Performance degradation
- Payment failures

## Deployment

### Development
```bash
docker-compose up
```

### Production (Future)
- AWS ECS / Kubernetes
- RDS PostgreSQL
- Application Load Balancer
- Auto-scaling groups
- CI/CD pipeline (GitHub Actions)

## Future Enhancements

1. **Mobile App** - React Native
2. **Real-time Notifications** - WebSockets/Firebase
3. **Advanced AI** - Custom trained model
4. **Geolocation** - Map integration
5. **Social Features** - Comments, shares
6. **Admin Dashboard** - Analytics, reports
7. **Multi-language** - i18n support
8. **Push Notifications** - Mobile alerts
9. **Video Support** - Animal videos
10. **Success Stories** - Adoption tracking

## Contributing

Lásd a CONTRIBUTING.md fájlt (később).

## License

TBD
