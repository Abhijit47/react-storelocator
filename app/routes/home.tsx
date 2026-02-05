import mapboxgl, { type Map } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
// import Marker from '~/components/marker';
import { createPortal } from 'react-dom';
import SidebarDemo from '~/components/sidebar-demo';
import { useStoreContext } from '~/contexts/store-context';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const [mapLoaded, setMapLoaded] = useState(false);
  // const [map, setMap] = useState<Map | null>(null);

  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { stores, selectedStore } = useStoreContext();

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWswMDciLCJhIjoiY2xkOW82MXkyMGE4aDNwc3o4MmN2MjEyayJ9.DKwcxajlq3hrUjNUYI3Sxw';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: [-77.03915, 38.90025],
      zoom: 12.5,
      style: 'mapbox://styles/mapbox/light-v11',
    });

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // useEffect(() => {
  //   // Set your Mapbox access token
  //   mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  //   if (!mapContainerRef.current) return;

  //   const newMap = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //     center: [-77.03915, 38.90025], // Washington DC
  //     zoom: 12.5,
  //     config: {
  //       basemap: { theme: 'faded' },
  //     },
  //     style: 'mapbox://styles/mapbox/light-v11',
  //   });

  //   newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

  //   newMap.on('load', () => {
  //     setMapLoaded(true);
  //   });

  //   mapRef.current = newMap;
  //   setMap(newMap);

  //   return () => {
  //     newMap.remove();
  //   };
  // }, []);

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
      <SidebarDemo />
      {/* Map container */}
      <div className='w-3/4'>
        <div className='h-full w-full' ref={mapContainerRef} />

        {/* Marker */}
        {mapLoaded &&
          stores.map((store) => (
            <Marker
              key={store.properties.name}
              feature={store}
              map={mapRef.current!}
            />
          ))}
      </div>
    </div>
  );
}

function Marker({ feature, map }: { feature: StoreFeature; map: Map }) {
  const { geometry } = feature;

  const { selectedStore, onSelectedStore } = useStoreContext();

  const contentRef = useRef(document.createElement('div'));
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const isSelected = feature.properties.name === selectedStore?.properties.name;
  useEffect(() => {
    markerRef.current = new mapboxgl.Marker(contentRef.current)
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map);

    return () => {
      markerRef.current?.remove();
    };
  }, []);

  return (
    <>
      {createPortal(
        <div
          onClick={() => onSelectedStore(feature)}
          className={
            'bg-contain bg-no-repeat cursor-pointer transition w-[37px] h-[40px]'
          }
          style={{
            backgroundImage: isSelected
              ? 'url("./sg-marker-selected.svg")'
              : 'url("./sg-marker.svg")',
          }}></div>,
        contentRef.current,
      )}
    </>
  );
}
