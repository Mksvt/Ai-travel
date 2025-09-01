import React from 'react';
import { Itinerary } from '../types/travel';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-3xl font-bold text-center">
        Your Trip to {itinerary.city}
      </h2>
      <div className="text-center">
        <p className="text-lg">
          Total Estimated Cost:{' '}
          <span className="font-semibold">${itinerary.summary.totalCost}</span>
        </p>
      </div>
      {itinerary.itinerary.map((day) => (
        <div
          key={day.day}
          className="p-4 border border-gray-200 rounded-lg shadow-sm"
        >
          <h3 className="text-2xl font-semibold">Day {day.day}</h3>
          {day.hotel && (
            <div className="p-3 mt-2 bg-blue-50 rounded-md">
              <h4 className="font-bold">Hotel: {day.hotel.name}</h4>
              <p>Price: ${day.hotel.price}</p>
            </div>
          )}
          <div className="mt-4 space-y-3">
            <h4 className="font-bold">Activities:</h4>
            {day.activities.map((activity, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="font-semibold">
                  {activity.place} ({activity.type})
                </p>
                <p>{activity.description}</p>
                <p>Cost: ${activity.cost}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <h4 className="font-bold">Transport:</h4>
            {day.transport.map((leg, index) => (
              <p key={index} className="text-sm text-gray-600">
                {leg.from} → {leg.to} ({leg.mode})
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryDisplay;
