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
  day: number;
  activities: Activity[];
  transport: Transport[];
  hotel: Hotel;
}

export interface Activity {
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
  name: string;
  price: number;
  lat: number;
  lng: number;
}
