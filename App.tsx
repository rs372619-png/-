import React, { useState, useEffect } from 'react';
import MapContainer from './components/MapContainer';
import Header from './components/Header';
import LayerControl from './components/LayerControl';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchNaturalEvents } from './services/nasaService';
import { EonetEvent } from './types';
import { LocateIcon } from './components/icons';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  // Geolocation state
  const { position: userPosition, isLoading: isGeoLoading, error: geoError } = useGeolocation();
  
  // Map state
  const [activeBaseLayer, setActiveBaseLayer] = useState('DARK');
  const [activeOverlays, setActiveOverlays] = useState<string[]>(['wildfires']);
  const [isFollowing, setIsFollowing] = useState(true);
  
  // NASA events state
  const [events, setEvents] = useState<EonetEvent[]>([]);
  const [isNasaLoading, setIsNasaLoading] = useState(false);
  const [nasaError, setNasaError] = useState<string | null>(null);

  // Effect to fetch NASA events when overlays change
  useEffect(() => {
    const fetchEvents = async () => {
      if (activeOverlays.length === 0) {
        setEvents([]);
        return;
      }
      setIsNasaLoading(true);
      setNasaError(null);
      try {
        const fetchedEvents = await fetchNaturalEvents(activeOverlays);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching NASA events:", error);
        setNasaError("Failed to load natural events data.");
      } finally {
        setIsNasaLoading(false);
      }
    };
    
    fetchEvents();
  }, [activeOverlays]);

  const handleRecenter = () => {
    setIsFollowing(true);
    // The MapContainer useEffect for userPosition will handle centering
  };
  
  return (
    <main className="relative h-screen w-screen bg-slate-900">
      <Header />
      <MapContainer 
        userPosition={userPosition}
        events={events}
        activeBaseLayer={activeBaseLayer}
        isFollowing={isFollowing}
        setIsFollowing={setIsFollowing}
      />
      <LayerControl 
        activeBaseLayer={activeBaseLayer}
        setActiveBaseLayer={setActiveBaseLayer}
        activeOverlays={activeOverlays}
        setActiveOverlays={setActiveOverlays}
        isNasaLoading={isNasaLoading}
      />
      
      {/* Geolocation Controls and Status */}
      <div className="absolute bottom-10 left-3 z-[1000] bg-slate-800/80 backdrop-blur-sm text-amber-50 p-2 rounded-lg border border-amber-300/30 shadow-lg flex items-center space-x-2">
        {isGeoLoading && (
          <div className="flex items-center space-x-2">
            <LoadingSpinner />
            <p className="text-xs">Finding you...</p>
          </div>
        )}
        {geoError && <p className="text-xs text-red-400">{geoError}</p>}
        {userPosition && (
          <button 
            onClick={handleRecenter} 
            className={`p-2 rounded-full transition-colors ${isFollowing ? 'bg-amber-400/80 text-slate-900 animate-pulse' : 'bg-slate-700/50 hover:bg-slate-600/70'}`}
            title="Recenter map on your location"
          >
            <LocateIcon />
          </button>
        )}
      </div>

      {/* NASA Error Display */}
      {nasaError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-red-500/80 text-white p-2 rounded-lg text-sm">
          {nasaError}
        </div>
      )}
    </main>
  );
}

export default App;
