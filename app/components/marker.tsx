import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface MarkerProps {
  feature: StoreFeature;
  map: mapboxgl.Map;
  selectedStore: StoreFeature | null;
  setSelectedStore: Function;
}

export default function Marker({
  map,
  feature,
  selectedStore,
  setSelectedStore,
}: MarkerProps) {
  const { geometry } = feature;

  const contentRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const isSelected = feature.properties.name === selectedStore?.properties.name;

  useEffect(() => {
    const newContainer = document.createElement('div');
    setContainer(newContainer);

    return () => {
      markerRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (container && contentRef.current) {
      markerRef.current = new mapboxgl.Marker(container)
        .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
        .addTo(map);
    }

    return () => {
      markerRef.current?.remove();
    };
  }, [container, geometry.coordinates, map]);

  return (
    <>
      {container
        ? createPortal(
            <div
              onClick={() => setSelectedStore(feature)}
              className={
                'bg-contain bg-no-repeat cursor-pointer transition w-[37px] h-[40px]'
              }
              style={{
                backgroundImage: isSelected
                  ? 'url("./markers/sg-marker-selected.svg")'
                  : 'url("./markers/sg-marker.svg")',
              }}
              ref={contentRef}></div>,
            container,
          )
        : null}
    </>
  );
}
