import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import Marker from '~/components/marker';
import SidebarDemo from '~/components/sidebar-demo';
import { storeLocations } from '~/constants';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [stores] = useState<StoreFeature[]>(storeLocations);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreFeature | null>(null);
  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-77.03915, 38.90025], // Washington DC
      zoom: 12.5,
      config: {
        basemap: { theme: 'faded' },
      },
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      mapRef.current?.remove();
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
    <div className='flex absolute top-0 left-0 right-0 bottom-0 h-full w-full'>
      <SidebarDemo
        stores={stores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
      />
      {/* Map container */}
      <div className='w-3/4'>
        <div className='h-full w-full' ref={mapContainerRef} />
        {mapLoaded &&
          stores.map((location) => (
            <Marker
              key={location.properties.name}
              feature={location}
              map={mapRef.current!}
              setSelectedStore={setSelectedStore}
              selectedStore={selectedStore}
            />
          ))}
      </div>
    </div>
  );
}
