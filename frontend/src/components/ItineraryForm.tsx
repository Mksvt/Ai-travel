import React, { useState } from 'react';
import { generateItinerary } from '../api/travel';
import { Itinerary } from '../types/travel';

interface ItineraryFormProps {
  onItineraryGenerated: (itinerary: Itinerary) => void;
  setLoading: (loading: boolean) => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  onItineraryGenerated,
  setLoading,
}) => {
  const [city, setCity] = useState('Paris');
  const [budget, setBudget] = useState(1000);
  const [days, setDays] = useState(3);
  const [preferences, setPreferences] = useState('culture, food');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await generateItinerary({ city, budget, days, preferences });
      onItineraryGenerated(data);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 bg-gray-100 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">Plan Your Trip</h2>
      {error && (
        <div className="p-2 text-red-700 bg-red-100 rounded">{error}</div>
      )}
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City / Country
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-700"
        >
          Budget (USD)
        </label>
        <input
          type="number"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="days"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Days
        </label>
        <input
          type="number"
          id="days"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="preferences"
          className="block text-sm font-medium text-gray-700"
        >
          Preferences (e.g., culture, nature, food)
        </label>
        <input
          type="text"
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Generate Itinerary
      </button>
    </form>
  );
};

export default ItineraryForm;
