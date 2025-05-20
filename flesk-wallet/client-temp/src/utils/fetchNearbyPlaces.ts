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
    radius: number = 2000
  ): Promise<NearbyPlace[]> => {
    const query = `
      [out:json];
      (
        // Magasins et commerces
        node["shop"](around:${radius},${lat},${lng});
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        node["shop"="convenience"](around:${radius},${lat},${lng});
        node["shop"="bakery"](around:${radius},${lat},${lng});
        node["shop"="butcher"](around:${radius},${lat},${lng});
        node["shop"="clothes"](around:${radius},${lat},${lng});
        node["shop"="pharmacy"](around:${radius},${lat},${lng});
        
        // Restaurants et cafés
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        node["amenity"="fast_food"](around:${radius},${lat},${lng});
        node["amenity"="bar"](around:${radius},${lat},${lng});
        
        // Services
        node["amenity"="bank"](around:${radius},${lat},${lng});
        node["amenity"="post_office"](around:${radius},${lat},${lng});
        node["amenity"="pharmacy"](around:${radius},${lat},${lng});
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        
        // Éducation
        node["amenity"="school"](around:${radius},${lat},${lng});
        node["amenity"="university"](around:${radius},${lat},${lng});
        node["amenity"="kindergarten"](around:${radius},${lat},${lng});
        
        // Transport
        node["amenity"="bus_station"](around:${radius},${lat},${lng});
        node["amenity"="taxi"](around:${radius},${lat},${lng});
        node["amenity"="fuel"](around:${radius},${lat},${lng});
        
        // Loisirs
        node["amenity"="cinema"](around:${radius},${lat},${lng});
        node["amenity"="theatre"](around:${radius},${lat},${lng});
        node["amenity"="library"](around:${radius},${lat},${lng});
        node["amenity"="gym"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["leisure"="playground"](around:${radius},${lat},${lng});
        
        // Hébergement
        node["tourism"="hotel"](around:${radius},${lat},${lng});
        node["tourism"="hostel"](around:${radius},${lat},${lng});
        node["tourism"="guest_house"](around:${radius},${lat},${lng});
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
  