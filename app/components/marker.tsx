import mapboxgl, { type Map, type Marker } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStoreContext } from '~/contexts/store-context';

interface MarkerProps {
  feature: StoreFeature;
  map: Map;
}

export default function CustomMarker({ map, feature }: MarkerProps) {
  const { geometry } = feature;

  const contentRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<Marker | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { selectedStore, onSelectedStore } = useStoreContext();

  const isSelected = feature.properties.name === selectedStore?.properties.name;

  // Initialize container once
  useEffect(() => {
    const newContainer = document.createElement('div');
    setContainer(newContainer);
  }, []);

  // Create and add marker to map when container is ready
  useEffect(() => {
    if (!container) return;

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker(container)
        .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
        .addTo(map);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [container, geometry.coordinates, map]);

  return (
    <>
      {container
        ? createPortal(
            <div
              onClick={() => onSelectedStore(feature)}
              className={
                'bg-contain bg-no-repeat cursor-pointer transition w-[37px] h-[40px]'
              }
              style={{
                backgroundImage: isSelected
                  ? 'url("/markers/sg-marker-selected.svg")'
                  : 'url("/markers/sg-marker.svg")',
              }}
              ref={contentRef}></div>,
            container,
          )
        : null}
    </>
  );
}
