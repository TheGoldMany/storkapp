# Karbantartási Útmutató / Maintenance Guide

Ez a dokumentum tartalmazza a Stork Animal Shelter alkalmazás karbantartási útmutatóját, különös tekintettel a lemezterület kezelésére.

## 📊 Lemezterület Kezelés / Disk Space Management

### Miért növekszik a program mérete? / Why is the application growing?

A program mérete az alábbi okok miatt növekedhet:

1. **Feltöltött képek** - A felhasználók által feltöltött állat/pet képek a `backend/uploads` könyvtárban tárolódnak
2. **Node_modules** (~315MB) - A fejlesztési függőségek (normális méret)
3. **Build artifactek** - A lefordított kód a `backend/dist` és `frontend/dist` könyvtárakban
4. **Docker layerek és volumek** - Ha Docker-t használsz, a régi layerek és volumek felhalmozódhatnak
5. **Adatbázis növekedés** - Az adatbázis mérete az adatok növekedésével nő

### 🧹 Automatikus Tisztítás / Automatic Cleanup

Az alkalmazás **automatikusan törli** a képfájlokat amikor:
- Törlöl egy állatot, elveszett állatot, vagy talált állatot a dashboardon
- Egy állat/pet státusza "REUNITED" vagy "ADOPTED"-re változik (3 nap múlva automatikusan törlődik az adatbázisból a képekkel együtt)

### 🔧 Manuális Tisztítási Műveletek / Manual Cleanup Operations

#### 1. Árva Képek Törlése / Delete Orphaned Images

Az "árva" képek olyan fájlok, amelyek már nincsenek az adatbázisban hivatkozva. Ezek előfordulhatnak ha:
- Manuálisan törölsz rekordokat az adatbázisból
- Fejlesztés/tesztelés során maradtak hátra fájlok

**Futtatás:**
```bash
cd backend
npm run cleanup:images
# vagy
ts-node src/scripts/cleanupOrphanedImages.ts
```

**Javasolt gyakoriság:** Hetente egyszer

#### 2. Node_modules Újratelepítése / Reinstall Node Modules

Ha úgy érzed, hogy a node_modules túl nagy vagy sérült:

```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd ../frontend
rm -rf node_modules
npm install
```

#### 3. Build Artifactek Törlése / Clean Build Artifacts

```bash
# Backend
cd backend
rm -rf dist
npm run build

# Frontend
cd ../frontend
rm -rf dist
npm run build
```

#### 4. Docker Tisztítás / Docker Cleanup

Ha Docker-t használsz, rendszeresen tisztítsd a fel nem használt erőforrásokat:

```bash
# Összes leállított konténer törlése / Remove all stopped containers
docker container prune -f

# Fel nem használt képek törlése / Remove unused images
docker image prune -a -f

# Fel nem használt volumek törlése / Remove unused volumes
docker volume prune -f

# MINDEN fel nem használt erőforrás törlése (VIGYÁZAT!) / Remove ALL unused resources (CAUTION!)
docker system prune -a -f --volumes
```

**FIGYELEM:** A `docker system prune -a` törli az **összes** fel nem használt Docker erőforrást!

#### 5. Adatbázis Optimalizálás / Database Optimization

PostgreSQL esetén:

```bash
# Belépés a konténerbe / Access the container
docker exec -it storkapp-db psql -U postgres -d storkapp

# Vacuum és analyze futtatása / Run vacuum and analyze
VACUUM ANALYZE;

# Kilépés / Exit
\q
```

### 📈 Lemezterület Monitorozás / Disk Space Monitoring

Ellenőrizd a könyvtárak méretét:

```bash
# Projekt könyvtárak mérete / Project directory sizes
du -sh backend/node_modules frontend/node_modules backend/uploads backend/dist frontend/dist

# Uploads könyvtár fájlszáma / Number of files in uploads
find backend/uploads -type f | wc -l

# Docker helyfoglalás / Docker disk usage
docker system df
```

### 🔄 Ajánlott Karbantartási Ütemezés / Recommended Maintenance Schedule

| Művelet / Task | Gyakoriság / Frequency |
|----------------|------------------------|
| Árva képek törlése / Orphaned images cleanup | Hetente / Weekly |
| Docker cleanup | Kéthetente / Bi-weekly |
| Adatbázis optimalizálás / Database optimization | Havonta / Monthly |
| Node_modules újratelepítése / Reinstall node_modules | Szükség szerint / As needed |

### 📦 Production Build Méret Csökkentés / Reduce Production Build Size

Production környezetben:

1. **Ne használd a development node_modules-t** / Don't use development node_modules
   ```bash
   npm ci --only=production
   ```

2. **Használj .dockerignore fájlt** / Use .dockerignore file
   - Már létezik a projektben / Already exists in the project

3. **Multi-stage Docker build** / Multi-stage Docker build
   - Már implementálva van / Already implemented

4. **Képek optimalizálása** / Optimize images
   - Fontold meg a képek automatikus tömörítését feltöltéskor / Consider automatic image compression on upload

### 🚨 Hibaelhárítás / Troubleshooting

#### "Disk is full" hiba / "Disk is full" error

1. Futtasd le az összes fenti cleanup műveletet
2. Ellenőrizd a log fájlokat: `find . -name "*.log" -exec ls -lh {} \;`
3. Ellenőrizd a Docker volumeket: `docker volume ls`
4. Szükség esetén növeld a lemezterületet

#### Túl sok kép van feltöltve / Too many images uploaded

Fontold meg egy képlimit bevezetését:
- Fájlméret limit: Jelenleg 5MB (beállítva)
- Képek száma limit: Jelenleg 5 kép/állat (beállítva)
- Storage quota felhasználónként (future feature)

### 💡 Hasznos Parancsok / Useful Commands

```bash
# Legnagyobb fájlok keresése / Find largest files
find . -type f -size +10M -exec ls -lh {} \;

# Legnagyobb könyvtárak / Largest directories
du -h --max-depth=2 | sort -rh | head -20

# Uploads könyvtár mérete / Uploads directory size
du -sh backend/uploads

# Összes Docker erőforrás mérete / Total Docker resources size
docker system df -v
```

## 🔐 Adatbázis Backup

Ne felejtsd el rendszeresen menteni az adatbázist törlési műveletek előtt!

```bash
# PostgreSQL backup
docker exec storkapp-db pg_dump -U postgres storkapp > backup_$(date +%Y%m%d).sql

# Backup visszaállítása / Restore backup
docker exec -i storkapp-db psql -U postgres storkapp < backup_20231125.sql
```

## 📞 Support

Ha további segítségre van szükséged, keresd a projekt maintainer-ét.
