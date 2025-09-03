import React, { useState, useEffect } from 'react';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import ItineraryMap from './components/ItineraryMap';
import { Itinerary } from './types/travel';
import { exportToPdf } from './api/travel';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedItineraryData = params.get('itinerary');
    if (sharedItineraryData) {
      try {
        const decodedItinerary = JSON.parse(atob(sharedItineraryData));
        setItinerary(decodedItinerary);
      } catch (error) {
        console.error('Failed to parse shared itinerary', error);
      }
    }
  }, []);

  const handleItineraryGenerated = (generatedItinerary: any) => {
    const itineraryWithIds: Itinerary = {
      ...generatedItinerary,
      id: uuidv4(),
      itinerary: generatedItinerary.itinerary.map((day: any) => ({
        ...day,
        id: uuidv4(),
        activities: day.activities.map((activity: any) => ({
          ...activity,
          id: uuidv4(),
        })),
        hotel: day.hotel ? { ...day.hotel, id: uuidv4() } : null,
      })),
    };
    setItinerary(itineraryWithIds);
    setShareableLink('');
    setIsSharing(false);
  };

  const handleExportPdf = async () => {
    if (!itinerary) return;
    setLoading(true);
    try {
      const data = await exportToPdf(itinerary);
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Failed to export PDF', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!itinerary) return;
    const encodedItinerary = btoa(JSON.stringify(itinerary));
    const link = `${window.location.origin}${window.location.pathname}?itinerary=${encodedItinerary}`;
    setShareableLink(link);
    setIsSharing(true);
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="p-4 text-white bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-center">
          AI Travel Planner 🌍🗺️
        </h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-2/5 overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-4">
            <ItineraryForm
              onItineraryGenerated={handleItineraryGenerated}
              setLoading={setLoading}
            />
          </div>
          {loading && !itinerary && (
            <div className="flex items-center justify-center p-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-2">Generating your trip...</p>
            </div>
          )}
          {itinerary && (
            <div className="p-4">
              <ItineraryDisplay
                itinerary={itinerary}
                setItinerary={setItinerary}
              />
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  onClick={handleExportPdf}
                  disabled={loading}
                >
                  {loading ? 'PDF...' : 'Download PDF'}
                </button>
                <button
                  className="px-6 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  onClick={handleShare}
                >
                  Share
                </button>
              </div>
              {isSharing && (
                <div className="p-2 mt-2 text-sm text-center bg-gray-100 border rounded">
                  <p>Shareable link copied!</p>
                  <input
                    type="text"
                    readOnly
                    value={shareableLink}
                    className="w-full p-1 mt-1 text-xs bg-white border rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1">
          <ItineraryMap itinerary={itinerary ? itinerary.itinerary : []} />
        </div>
      </main>
    </div>
  );
}

export default App;
