# 🗺️ Geocoding Útmutató / Geocoding Guide

## Windows-on / On Windows

### 1. Lépés: Húzd le a változásokat / Pull the Changes

```bash
# Nyisd meg a Git Bash vagy PowerShell-t a projekt mappájában
cd C:\Users\terra\Desktop\Projekt\Dogapp\Storkapp\storkapp

# Húzd le a legfrissebb változásokat
git pull origin claude/animal-shelter-app-011CUqRvD2Df4FsUnzMJuEQa
```

### 2. Lépés: Ellenőrizd hogy a script ott van-e / Verify Script Exists

```bash
# Nézd meg hogy létezik-e a fájl
dir backend\src\scripts\geocodeExistingRecords.ts

# Ellenőrizd a package.json-t
type backend\package.json | findstr geocode
```

Ha **NINCS** ott a script, akkor:
```bash
# Frissítsd a node_modules-t
cd backend
npm install
```

### 3. Lépés: Futtasd a geocoding scriptet / Run Geocoding Script

```bash
cd backend
npm run geocode:existing
```

## ❗ Ha nem működik a git pull / If git pull doesn't work

### Alternatíva 1: Stash és Pull

```bash
# Mentsd el a lokális változtatásokat
git stash

# Húzd le a változásokat
git pull origin claude/animal-shelter-app-011CUqRvD2Df4FsUnzMJuEQa

# Állítsd vissza a változtatásokat
git stash pop
```

### Alternatíva 2: Manuális Geocoding (Gyors módszer)

Ha a git pull nem működik, futtasd ezt a parancsot a `backend` mappában:

**PowerShell:**
```powershell
# 1. Hozd létre a geocoding scriptet manuálisan
# Másold be ezt a fájlt: backend/src/scripts/geocodeExistingRecords.ts
# (A tartalom alább található)

# 2. Adj hozzá egy sort a package.json "scripts" részéhez:
# "geocode:existing": "ts-node src/scripts/geocodeExistingRecords.ts",

# 3. Futtasd:
npm run geocode:existing
```

## 🔧 Hibaelhárítás / Troubleshooting

### "Missing script" hiba

**Probléma:** `npm error Missing script: "geocode:existing"`

**Megoldás:**
1. Ellenőrizd hogy a `backend/package.json` fájlban van-e a script:
   ```json
   "scripts": {
     ...
     "geocode:existing": "ts-node src/scripts/geocodeExistingRecords.ts",
     ...
   }
   ```

2. Ha nincs ott, add hozzá manuálisan a "scripts" részhez

3. Ellenőrizd hogy létezik-e a fájl:
   - `backend/src/scripts/geocodeExistingRecords.ts`

### "ts-node not found" hiba

**Megoldás:**
```bash
cd backend
npm install
```

### "Cannot find module '@prisma/client'" hiba

**Megoldás:**
```bash
cd backend
npm run prisma:generate
```

## 📊 Mit csinál a script? / What does the script do?

1. **Megkeresi** az összes rekordot (shelter, lost pets, found pets) amelyeknek nincs GPS koordinátájuk
2. **Geocodingol** minden címet az OpenStreetMap Nominatim API-val
3. **Frissíti** az adatbázist a koordinátákkal
4. **Megjelenít** részletes progresst:
   ```
   📍 Geocoding shelters...
   Found 5 shelters without coordinates
     ✓ Állatbarát Menhely (Budapest)
     ✓ Kutyamentők (Debrecen)
   ...
   ```

## ⏱️ Mennyi időbe telik? / How long does it take?

- **1 másodperc** / rekord (rate limiting miatt)
- Ha van **10 shelter + 20 lost pets + 15 found pets** = **45 másodperc**

## ⚠️ Fontos megjegyzések / Important Notes

1. **Internet kapcsolat szükséges** - A geocoding online API-t használ
2. **Rate limiting** - 1 másodperc várakozás rekordok között
3. **OpenStreetMap** - Ingyenes, de ne spamold túl gyakori futtatással
4. **Nem minden cím geocodingolható** - Néhány sikertelen lehet ha rossz a cím

## ✅ Ellenőrzés / Verification

A script futása után:

1. Menj a weboldal főoldalára
2. Görgess le a térképig
3. Most már **látnod kell a markereket**:
   - 🟠 Narancs = Menhelyek
   - 🔴 Piros = Elveszett állatok
   - 🟢 Zöld = Talált állatok
   - 🔵 Kék = Gazdájához került állatok

## 🆘 Ha semmi nem működik / If nothing works

Írj nekem egy üzenetet a következő információkkal:

1. A `git status` kimenet
2. A `git log --oneline -5` kimenet
3. A `type backend\package.json` kimenet (csak a scripts rész)
4. A hibaüzenet teljes szövege

---

## 📝 Gyors parancsok összefoglalója / Quick Commands Summary

```bash
# 1. Projekt mappába lépés
cd C:\Users\terra\Desktop\Projekt\Dogapp\Storkapp\storkapp

# 2. Változások lehúzása
git pull origin claude/animal-shelter-app-011CUqRvD2Df4FsUnzMJuEQa

# 3. Backend mappába lépés
cd backend

# 4. Geocoding futtatása
npm run geocode:existing

# 5. Ellenőrzés a térképen
# Nyisd meg: http://localhost:5173 (vagy ahol a frontend fut)
```

---

**Sikerült?** Ha igen, menj a weboldalra és nézd meg a térképet! 🎉
