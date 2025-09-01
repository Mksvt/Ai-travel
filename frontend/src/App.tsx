import React, { useState } from 'react';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import ItineraryMap from './components/ItineraryMap';
import { Itinerary } from './types/travel';
import { exportToPdf } from './api/travel';
import './App.css';

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleItineraryGenerated = (generatedItinerary: Itinerary) => {
    setItinerary(generatedItinerary);
    setPdfUrl(null); // Reset PDF URL when new itinerary is generated
  };

  const handleExportPdf = async () => {
    if (!itinerary) return;
    setLoading(true);
    try {
      const data = await exportToPdf(itinerary);
      setPdfUrl(data.url);
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Failed to export PDF', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <header className="p-4 text-white bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-center">
          AI Travel Planner 🌍🗺️
        </h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel: Form and Itinerary */}
        <div className="w-1/3 overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-4">
            <ItineraryForm
              onItineraryGenerated={handleItineraryGenerated}
              setLoading={setLoading}
            />
          </div>
          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-2">Generating your trip...</p>
            </div>
          )}
          {itinerary && (
            <div className="p-4">
              <ItineraryDisplay itinerary={itinerary} />
              <div className="mt-4 text-center">
                <button
                  className="px-6 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
                  onClick={handleExportPdf}
                  disabled={loading}
                >
                  {loading ? 'Generating PDF...' : 'Download PDF Guide'}
                </button>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-600"
                  >
                    Open PDF in new tab
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Map */}
        <div className="flex-1">
          <ItineraryMap itinerary={itinerary ? itinerary.itinerary : []} />
        </div>
      </main>
    </div>
  );
}

export default App;
