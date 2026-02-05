import mapboxgl, { type Map, type Marker } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStoreContext } from '~/contexts/store-context';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface MarkerProps {
  feature: StoreFeature;
  map: Map;
}

export default function CustomMarker({ map, feature }: MarkerProps) {
  const { geometry } = feature;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const markerRef = useRef<Marker | null>(null);

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
            <Popover
              open={isSelected}
              onOpenChange={(open) => {
                if (!open) onSelectedStore(null);
              }}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size={'icon-xs'}
                  className={'rounded-full!'}
                  onClick={() => onSelectedStore(feature)}>
                  {isSelected ? (
                    <img
                      src='/markers/sg-marker-selected.svg'
                      alt={`Marker for ${feature.properties.name}`}
                      className={'h-full w-full'}
                    />
                  ) : (
                    <img
                      src='/markers/sg-marker.svg'
                      alt={`Marker for ${feature.properties.name}`}
                      className={'h-full w-full'}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>
                    <h3 className='text-lg font-medium'>
                      {feature.properties.name}
                    </h3>
                  </PopoverTitle>
                  <Separator />
                  <PopoverDescription>
                    <span className='block text-sm text-muted-foreground'>
                      {feature.properties.address}
                    </span>
                    <span className='block text-sm text-muted-foreground'>
                      {feature.properties.city}
                    </span>
                    <span className='block text-sm text-muted-foreground'>
                      {feature.properties.country}
                    </span>
                    <span className='block text-sm text-muted-foreground'>
                      {feature.properties.state}
                    </span>
                    <span className='block text-sm text-muted-foreground'>
                      {feature.properties.phone}
                    </span>
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>,
            container,
          )
        : null}
    </>
  );
}
