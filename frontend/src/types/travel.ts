export interface Itinerary {
  id: string;
  city: string;
  country?: string;
  budget: number;
  days: number;
  preferences?: string;
  itinerary: DayPlan[];
  summary: {
    totalCost: number;
  };
  createdAt: Date;
}

export interface DayPlan {
  id: string; // Unique ID for the day
  day: number;
  activities: Activity[];
  transport: Transport[];
  hotel: Hotel;
}

export interface Activity {
  id: string; // Unique ID for the activity
  place: string;
  type: 'museum' | 'restaurant' | 'park' | 'attraction';
  description: string;
  cost: number;
  lat: number;
  lng: number;
}

export interface Transport {
  from: string;
  to: string;
  mode: 'walk' | 'bus' | 'train' | 'taxi';
}

export interface Hotel {
  id: string; // Unique ID for the hotel
  name: string;
  price: number;
  lat: number;
  lng: number;
}
