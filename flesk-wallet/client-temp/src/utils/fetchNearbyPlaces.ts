// client-temp/src/utils/fetchNearbyPlaces.ts

export interface NearbyPlace {
    id: number;
    lat: number;
    lon: number;
    tags: {
      name?: string;
      shop?: string;
      amenity?: string;
      [key: string]: any;
    };
  }
  
  export const fetchNearbyPlaces = async (
    lat: number,
    lng: number,
    radius: number = 1000
  ): Promise<NearbyPlace[]> => {
    const query = `
      [out:json];
      (
        node["shop"](around:${radius},${lat},${lng});
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
      );
      out body;
    `;
  
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des lieux");
      }
  
      const data = await response.json();
      return data.elements as NearbyPlace[];
    } catch (error) {
      console.error("Erreur fetchNearbyPlaces:", error);
      return [];
    }
  };
  
  // 👇 Ajoute cette ligne tout en bas
  export {};
  