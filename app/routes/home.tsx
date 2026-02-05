import mapboxgl, { type Map } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import CustomMarker from '~/components/marker';
import StoreSidebar from '~/components/store-sidebar';
import { Skeleton } from '~/components/ui/skeleton';
import { useStoreContext } from '~/contexts/store-context';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: 'Store Locator with React Router and Mapbox GL JS',
    },
    {
      name: 'description',
      content:
        'A store locator application built with React Router, Mapbox GL JS, and TypeScript.',
    },
  ];
}

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<Map | null>(null);

  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { stores, selectedStore } = useStoreContext();

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    if (!mapContainerRef.current) return;

    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-77.03915, 38.90025], // Washington DC
      zoom: 12.5,
      config: {
        basemap: { theme: 'faded' },
      },
      style: 'mapbox://styles/mapbox/light-v11',
      devtools: true, // Enable Mapbox GL JS devtools
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      trackResize: true,
      respectPrefersReducedMotion: true,
    });

    // Navigation controls (zoom in/out)
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Scale control (distance measurement)
    newMap.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    // Fullscreen control
    newMap.addControl(new mapboxgl.FullscreenControl(), 'top-left');

    // Geolocate control (user location)
    newMap.addControl(new mapboxgl.GeolocateControl(), 'top-left');

    newMap.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = newMap;
    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedStore || !mapRef.current) return;

    mapRef.current.flyTo({
      center: [
        selectedStore.geometry.coordinates[0],
        selectedStore.geometry.coordinates[1],
      ],
      zoom: 13,
      duration: 1000,
    });
  }, [selectedStore]);

  return (
    <StoreSidebar>
      <div className='relative flex flex-1 flex-col h-full gap-4 p-4'>
        {!mapLoaded && (
          <Skeleton className='absolute inset-0 h-full w-full animate-pulse' />
        )}

        <div className='h-full w-full' ref={mapContainerRef} />

        {mapLoaded &&
          map &&
          stores.map((store) => (
            <CustomMarker
              key={store.properties.name}
              feature={store}
              map={map}
            />
          ))}
      </div>
    </StoreSidebar>
  );
}
