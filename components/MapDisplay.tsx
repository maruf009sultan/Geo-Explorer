import React, { useState, useEffect } from 'react';
import { RecenterIcon } from './Icons';
import { MapConfig } from '../types';

interface MapDisplayProps {
  config: MapConfig | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ config }) => {
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    setIframeKey(Date.now());
  }, [config]);

  const handleRecenter = () => {
    setIframeKey(Date.now());
  };
  
  const isInvalidQuery = !config || (config.type === 'search' && (!config.query || config.query === '__NO_RESULT__'));

  let mapSrc = 'about:blank';

  if (!isInvalidQuery && config) {
    if (config.type === 'search') {
      mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(config.query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    } else if (config.type === 'directions') {
      mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(config.origin)}&daddr=${encodeURIComponent(config.destination)}&output=embed`;
    }
  }

  return (
    <div className="relative h-full w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
      {isInvalidQuery ? (
        <div className="text-center text-gray-400 p-4">
          <p className="font-semibold">No location to display</p>
          <p className="text-sm mt-1">
            {config?.type === 'search' && config.query === '__NO_RESULT__'
              ? 'Could not determine a specific location.'
              : 'Find a place or route to see it on the map.'}
          </p>
        </div>
      ) : (
        <>
          <iframe
            key={iframeKey}
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(1) hue-rotate(180deg)' }}
            loading="lazy"
            allowFullScreen
            src={mapSrc}
          ></iframe>
          <button
            onClick={handleRecenter}
            className="absolute top-3 right-3 bg-gray-900 bg-opacity-80 text-white rounded-md p-2 shadow-lg hover:bg-opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            aria-label="Recenter map"
            title="Recenter map"
          >
            <RecenterIcon className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default MapDisplay;