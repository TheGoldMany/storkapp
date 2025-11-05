import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import numpy as np
from typing import List, Dict
import io
import httpx
import asyncio


class ImageMatcher:
    """
    AI-powered image matching service for pet recognition
    Uses ResNet50 pre-trained model for feature extraction
    """

    def __init__(self, model_path: str = None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")

        # Load pre-trained ResNet50 model
        self.model = models.resnet50(pretrained=True)
        self.model = torch.nn.Sequential(*list(self.model.children())[:-1])  # Remove last layer
        self.model.to(self.device)
        self.model.eval()

        # Image transformations
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

        self._loaded = True

    def is_loaded(self) -> bool:
        return self._loaded

    async def download_image(self, url: str) -> Image.Image:
        """Download image from URL"""
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content)).convert('RGB')

    def extract_features(self, image: Image.Image) -> np.ndarray:
        """Extract feature vector from image using ResNet50"""
        with torch.no_grad():
            img_tensor = self.transform(image).unsqueeze(0).to(self.device)
            features = self.model(img_tensor)
            features = features.squeeze().cpu().numpy()
            # Normalize
            features = features / np.linalg.norm(features)
            return features

    def cosine_similarity(self, feat1: np.ndarray, feat2: np.ndarray) -> float:
        """Calculate cosine similarity between two feature vectors"""
        return float(np.dot(feat1, feat2) / (np.linalg.norm(feat1) * np.linalg.norm(feat2)))

    async def compare_images(
        self,
        images1: List[str],
        images2: List[str]
    ) -> Dict[str, float]:
        """
        Compare two sets of images and return similarity score

        Returns:
            Dict with 'score' (0-100) and 'confidence' (0-100)
        """
        try:
            # Download and extract features from first set
            features1 = []
            for img_url in images1[:3]:  # Limit to first 3 images
                try:
                    img = await self.download_image(img_url)
                    feat = self.extract_features(img)
                    features1.append(feat)
                except Exception as e:
                    print(f"Error processing image {img_url}: {e}")

            # Download and extract features from second set
            features2 = []
            for img_url in images2[:3]:
                try:
                    img = await self.download_image(img_url)
                    feat = self.extract_features(img)
                    features2.append(feat)
                except Exception as e:
                    print(f"Error processing image {img_url}: {e}")

            if not features1 or not features2:
                return {"score": 0.0, "confidence": 0.0}

            # Calculate all pairwise similarities
            similarities = []
            for f1 in features1:
                for f2 in features2:
                    sim = self.cosine_similarity(f1, f2)
                    similarities.append(sim)

            # Use max similarity as the score
            max_similarity = max(similarities)
            avg_similarity = np.mean(similarities)

            # Convert to 0-100 scale
            score = max_similarity * 100
            confidence = (max_similarity * 0.6 + avg_similarity * 0.4) * 100

            return {
                "score": float(score),
                "confidence": float(confidence)
            }

        except Exception as e:
            print(f"Error in compare_images: {e}")
            return {"score": 0.0, "confidence": 0.0}

    async def find_matches(
        self,
        query_images: List[str],
        candidate_images_list: List[Dict[str, any]],
        threshold: float = 0.65
    ) -> List[Dict]:
        """
        Find all matches above threshold from a list of candidates

        Args:
            query_images: List of image URLs to search for
            candidate_images_list: List of dicts with 'id' and 'images' keys
            threshold: Minimum confidence threshold (0-1)

        Returns:
            List of matches with id, score, and confidence
        """
        matches = []

        for candidate in candidate_images_list:
            if not candidate.get('images'):
                continue

            result = await self.compare_images(query_images, candidate['images'])

            if result['confidence'] >= threshold * 100:
                matches.append({
                    'id': candidate['id'],
                    'score': result['score'],
                    'confidence': result['confidence']
                })

        # Sort by confidence descending
        matches.sort(key=lambda x: x['confidence'], reverse=True)

        return matches
