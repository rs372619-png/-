import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Position, EonetEvent } from '../types';
import { MAP_LAYERS } from '../constants';
import { WildfireIcon, VolcanoIcon, StormIcon, IcebergIcon } from './icons';

interface MapContainerProps {
  userPosition: Position | null;
  events: EonetEvent[];
  activeBaseLayer: string;
  isFollowing: boolean;
  setIsFollowing: (isFollowing: boolean) => void;
}

const getEventIcon = (categoryId: string) => {
  const iconProps = {
    iconSize: [24, 24] as L.PointExpression,
    className: 'bg-slate-800/50 rounded-full p-1 backdrop-blur-sm',
  };

  let iconElement: React.ReactElement;
  switch (categoryId) {
    case 'wildfires':
      iconElement = <WildfireIcon />;
      break;
    case 'volcanoes':
      iconElement = <VolcanoIcon />;
      break;
    case 'severeStorms':
      iconElement = <StormIcon />;
      break;
    case 'icebergs':
      iconElement = <IcebergIcon />;
      break;
    default:
      iconElement = <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white" />;
  }
  
  return L.divIcon({
    ...iconProps,
    html: renderToStaticMarkup(iconElement),
  });
};

const MapContainer: React.FC<MapContainerProps> = ({ userPosition, events, activeBaseLayer, isFollowing, setIsFollowing }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const eventMarkersRef = useRef<L.LayerGroup>(L.layerGroup());
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 3,
        zoomControl: false,
      });
      L.control.zoom({ position: 'bottomleft' }).addTo(map);
      mapRef.current = map;
      eventMarkersRef.current.addTo(map);

      tileLayerRef.current = L.tileLayer(MAP_LAYERS.DARK.url, {
        attribution: MAP_LAYERS.DARK.attribution
      }).addTo(map);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && activeBaseLayer && MAP_LAYERS[activeBaseLayer]) {
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(MAP_LAYERS[activeBaseLayer].url);
        tileLayerRef.current.options.attribution = MAP_LAYERS[activeBaseLayer].attribution;
        // Force redraw of attribution control
        mapRef.current.attributionControl.setPrefix(false);
        mapRef.current.attributionControl.addAttribution(MAP_LAYERS[activeBaseLayer].attribution);
      }
    }
  }, [activeBaseLayer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userPosition) return;
    
    const userLatLng: L.LatLngTuple = [userPosition.latitude, userPosition.longitude];

    // Create or update marker
    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'user-location-pulse',
        iconSize: [16, 16],
      });
      userMarkerRef.current = L.marker(userLatLng, { icon: userIcon }).addTo(map);
      // On first marker creation, always center the map with a fly-to animation
      map.flyTo(userLatLng, 15);
    } else {
      userMarkerRef.current.setLatLng(userLatLng);
    }
    
    // If following is enabled, keep the map centered on user
    if (isFollowing) {
      // Use setView for subsequent updates for a less jarring experience than flyTo
      map.setView(userLatLng);
    }
  }, [userPosition, isFollowing]);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    const onDragStart = () => {
      if (isFollowing) {
        setIsFollowing(false);
      }
    };
    
    map.on('dragstart', onDragStart);

    return () => {
      map.off('dragstart', onDragStart);
    };
  }, [isFollowing, setIsFollowing]);

  useEffect(() => {
    if (mapRef.current) {
      eventMarkersRef.current.clearLayers();
      (events || []).forEach(event => {
        // Defensive check for malformed event data
        if (!event || !Array.isArray(event.geometries)) {
          return;
        }
        
        const categoryId = event.categories[0]?.id;
        const icon = getEventIcon(categoryId);

        event.geometries.forEach(geom => {
          if (geom && geom.type === 'Point' && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
            const coords = geom.coordinates as [number, number];
            // EONET gives [lon, lat], Leaflet wants [lat, lon]
            const marker = L.marker([coords[1], coords[0]], { icon });
            marker.bindPopup(`
              <div class="bg-slate-700 text-white p-2 rounded-md shadow-lg max-w-xs">
                <h4 class="font-bold text-amber-300">${event.title}</h4>
                <p class="text-xs">${new Date(geom.date).toUTCString()}</p>
                <a href="${event.link}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline text-sm">More Info</a>
              </div>
            `, {
              className: 'custom-popup',
              closeButton: false,
            });
            eventMarkersRef.current.addLayer(marker);
          }
        });
      });
    }
  }, [events]);

  return (
    <div ref={mapContainerRef} className="h-screen w-screen" style={{ backgroundColor: '#1a1a1a' }}/>
  );
};

export default MapContainer;