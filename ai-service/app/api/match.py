from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import asyncio

from app.services.image_matcher import ImageMatcher
from app.services.database import DatabaseService

router = APIRouter()

matcher = ImageMatcher()
db = DatabaseService()


class LostPetMatchRequest(BaseModel):
    lostPetId: str
    images: List[str]
    type: str
    city: str


class FoundPetMatchRequest(BaseModel):
    foundPetId: str
    images: List[str]
    type: str
    city: str


class MatchResponse(BaseModel):
    matchId: str
    confidence: float
    imageSimScore: float


@router.post("/lost-pet", response_model=List[MatchResponse])
async def match_lost_pet(
    request: LostPetMatchRequest,
    background_tasks: BackgroundTasks
):
    """
    Find potential matches for a lost pet by comparing with found pets and shelter animals
    """
    try:
        # Run matching in background
        background_tasks.add_task(
            process_lost_pet_matching,
            request.lostPetId,
            request.images,
            request.type,
            request.city
        )

        return {"status": "processing", "message": "Matching started in background"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/found-pet", response_model=List[MatchResponse])
async def match_found_pet(
    request: FoundPetMatchRequest,
    background_tasks: BackgroundTasks
):
    """
    Find potential matches for a found pet by comparing with lost pets
    """
    try:
        background_tasks.add_task(
            process_found_pet_matching,
            request.foundPetId,
            request.images,
            request.type,
            request.city
        )

        return {"status": "processing", "message": "Matching started in background"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def process_lost_pet_matching(
    lost_pet_id: str,
    lost_pet_images: List[str],
    animal_type: str,
    city: str
):
    """
    Background task to match lost pet with found pets and shelter animals
    """
    try:
        # Get found pets from database
        found_pets = await db.get_found_pets(animal_type=animal_type, city=city)

        # Get shelter animals
        shelter_animals = await db.get_shelter_animals(animal_type=animal_type, city=city)

        matches = []

        # Compare with found pets
        for found_pet in found_pets:
            if found_pet['images']:
                similarity = await matcher.compare_images(
                    lost_pet_images,
                    found_pet['images']
                )

                if similarity['confidence'] > 65:  # Threshold
                    match = await db.create_match(
                        lost_pet_id=lost_pet_id,
                        found_pet_id=found_pet['id'],
                        confidence=similarity['confidence'],
                        image_sim_score=similarity['score']
                    )
                    matches.append(match)

        # Compare with shelter animals
        for animal in shelter_animals:
            if animal['images']:
                similarity = await matcher.compare_images(
                    lost_pet_images,
                    animal['images']
                )

                if similarity['confidence'] > 65:
                    match = await db.create_match(
                        lost_pet_id=lost_pet_id,
                        animal_id=animal['id'],
                        confidence=similarity['confidence'],
                        image_sim_score=similarity['score']
                    )
                    matches.append(match)

        print(f"Found {len(matches)} matches for lost pet {lost_pet_id}")

    except Exception as e:
        print(f"Error in lost pet matching: {e}")


async def process_found_pet_matching(
    found_pet_id: str,
    found_pet_images: List[str],
    animal_type: str,
    city: str
):
    """
    Background task to match found pet with lost pets
    """
    try:
        # Get lost pets from database
        lost_pets = await db.get_lost_pets(animal_type=animal_type, city=city)

        matches = []

        for lost_pet in lost_pets:
            if lost_pet['images']:
                similarity = await matcher.compare_images(
                    found_pet_images,
                    lost_pet['images']
                )

                if similarity['confidence'] > 65:
                    match = await db.create_match(
                        lost_pet_id=lost_pet['id'],
                        found_pet_id=found_pet_id,
                        confidence=similarity['confidence'],
                        image_sim_score=similarity['score']
                    )
                    matches.append(match)

        print(f"Found {len(matches)} matches for found pet {found_pet_id}")

    except Exception as e:
        print(f"Error in found pet matching: {e}")


@router.get("/test")
async def test_matching():
    """Test endpoint to verify the matching service is working"""
    return {
        "status": "ok",
        "service": "AI Matching Service",
        "model_loaded": matcher.is_loaded()
    }
