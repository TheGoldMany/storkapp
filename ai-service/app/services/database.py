import asyncpg
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()


class DatabaseService:
    """Service for database operations"""

    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL")
        self.pool = None

    async def connect(self):
        """Create database connection pool"""
        if not self.pool:
            self.pool = await asyncpg.create_pool(self.database_url)

    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()

    async def get_lost_pets(
        self,
        animal_type: Optional[str] = None,
        city: Optional[str] = None,
        status: str = "LOST"
    ) -> List[Dict]:
        """Get lost pets from database"""
        if not self.pool:
            await self.connect()

        query = """
            SELECT id, name, type, breed, images, "lastSeenCity"
            FROM lost_pets
            WHERE status = $1
        """
        params = [status]

        if animal_type:
            query += f" AND type = ${len(params) + 1}"
            params.append(animal_type)

        if city:
            query += f" AND LOWER(\"lastSeenCity\") LIKE LOWER(${len(params) + 1})"
            params.append(f"%{city}%")

        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def get_found_pets(
        self,
        animal_type: Optional[str] = None,
        city: Optional[str] = None,
        status: str = "FOUND"
    ) -> List[Dict]:
        """Get found pets from database"""
        if not self.pool:
            await self.connect()

        query = """
            SELECT id, type, breed, images, "foundCity"
            FROM found_pets
            WHERE status = $1
        """
        params = [status]

        if animal_type:
            query += f" AND type = ${len(params) + 1}"
            params.append(animal_type)

        if city:
            query += f" AND LOWER(\"foundCity\") LIKE LOWER(${len(params) + 1})"
            params.append(f"%{city}%")

        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def get_shelter_animals(
        self,
        animal_type: Optional[str] = None,
        city: Optional[str] = None,
        status: str = "AVAILABLE"
    ) -> List[Dict]:
        """Get shelter animals from database"""
        if not self.pool:
            await self.connect()

        query = """
            SELECT a.id, a.name, a.type, a.breed, a.images, s.city
            FROM animals a
            JOIN shelters s ON a."shelterId" = s.id
            WHERE a.status = $1
        """
        params = [status]

        if animal_type:
            query += f" AND a.type = ${len(params) + 1}"
            params.append(animal_type)

        if city:
            query += f" AND LOWER(s.city) LIKE LOWER(${len(params) + 1})"
            params.append(f"%{city}%")

        async with self.pool.acquire() as conn:
            rows = await conn.fetch(query, *params)
            return [dict(row) for row in rows]

    async def create_match(
        self,
        lost_pet_id: Optional[str] = None,
        found_pet_id: Optional[str] = None,
        animal_id: Optional[str] = None,
        confidence: float = 0.0,
        image_sim_score: float = 0.0
    ) -> Dict:
        """Create a match record in database"""
        if not self.pool:
            await self.connect()

        query = """
            INSERT INTO matches (
                "lostPetId", "foundPetId", "animalId",
                confidence, "imageSimScore"
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, confidence, "imageSimScore"
        """

        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(
                query,
                lost_pet_id,
                found_pet_id,
                animal_id,
                confidence,
                image_sim_score
            )
            return dict(row)

    async def get_match(self, match_id: str) -> Optional[Dict]:
        """Get a specific match by ID"""
        if not self.pool:
            await self.connect()

        query = """
            SELECT * FROM matches WHERE id = $1
        """

        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(query, match_id)
            return dict(row) if row else None

    async def update_match(
        self,
        match_id: str,
        verified: Optional[bool] = None,
        dismissed: Optional[bool] = None
    ) -> Dict:
        """Update match status"""
        if not self.pool:
            await self.connect()

        updates = []
        params = []
        param_count = 1

        if verified is not None:
            updates.append(f"verified = ${param_count}")
            params.append(verified)
            param_count += 1

        if dismissed is not None:
            updates.append(f"dismissed = ${param_count}")
            params.append(dismissed)
            param_count += 1

        params.append(match_id)

        query = f"""
            UPDATE matches
            SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING id, confidence, verified, dismissed
        """

        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(query, *params)
            return dict(row)
