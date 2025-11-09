import axios from 'axios';

interface GeocodingResult {
  latitude: number;
  longitude: number;
}

class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  async geocodeAddress(address: string, city: string, country: string = 'Hungary'): Promise<GeocodingResult | null> {
    try {
      const query = `${address}, ${city}, ${country}`;

      const response = await axios.get(this.nominatimUrl, {
        params: {
          q: query,
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'StorkApp/1.0',
        },
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();
