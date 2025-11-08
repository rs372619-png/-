import React, { useState } from 'react';
import { MAP_LAYERS, NASA_CATEGORIES } from '../constants';
import { NasaCategory } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface LayerControlProps {
  activeBaseLayer: string;
  setActiveBaseLayer: (layer: string) => void;
  activeOverlays: string[];
  setActiveOverlays: (overlays: string[]) => void;
  isNasaLoading: boolean;
}

const LayerControl: React.FC<LayerControlProps> = ({
  activeBaseLayer,
  setActiveBaseLayer,
  activeOverlays,
  setActiveOverlays,
  isNasaLoading
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleOverlayToggle = (categoryId: string) => {
    const currentIndex = activeOverlays.indexOf(categoryId);
    const newOverlays = [...activeOverlays];

    if (currentIndex === -1) {
      newOverlays.push(categoryId);
    } else {
      newOverlays.splice(currentIndex, 1);
    }
    setActiveOverlays(newOverlays);
  };

  return (
    <div className="absolute top-20 right-4 z-[1000] bg-slate-800/80 backdrop-blur-sm text-amber-50 p-4 rounded-lg border border-amber-300/30 shadow-lg w-64">
      <div className="flex justify-between items-center border-b border-amber-300/30 pb-2 mb-3">
        <h2 className="text-lg font-bold font-title">Map Layers</h2>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-full hover:bg-slate-700/50 transition-colors" aria-label={isCollapsed ? 'Show layers' : 'Hide layers'}>
          {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="transition-all duration-300 ease-in-out">
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-200">Base Map</h3>
            {Object.entries(MAP_LAYERS).map(([key, layer]) => (
              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="baseLayer"
                  className="form-radio text-amber-400 bg-slate-700 border-slate-600 focus:ring-amber-400"
                  checked={activeBaseLayer === key}
                  onChange={() => setActiveBaseLayer(key)}
                />
                <span>{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-amber-300/30">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-amber-200">Natural Events</h3>
                {isNasaLoading && <LoadingSpinner />}
            </div>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {NASA_CATEGORIES.map((category: NasaCategory) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox text-amber-400 bg-slate-700 border-slate-600 focus:ring-amber-400 rounded"
                    checked={activeOverlays.includes(category.id)}
                    onChange={() => handleOverlayToggle(category.id)}
                  />
                  <span>{category.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControl;