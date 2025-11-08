import { useState, useEffect } from 'react';
import { Position } from '../types';

interface GeolocationState {
  position: Position | null;
  error: string | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: "Geolocation is not supported by your browser.",
        isLoading: false,
      });
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          position: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (err) => {
        setState({
          position: null,
          error: err.message,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return state;
};
