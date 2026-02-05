import { useEffect, useRef } from 'react';
import { useStoreContext } from '~/contexts/store-context';

export default function SidebarDemo() {
  const { stores, selectedStore, onSelectedStore } = useStoreContext();
  const storeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to the active location when it changes (desktop only)
  useEffect(() => {
    if (
      selectedStore &&
      storeRefs.current &&
      storeRefs.current[selectedStore.properties.name]
    ) {
      const element = storeRefs.current[selectedStore.properties.name];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth', // Optionally smooth scrolling
          block: 'start', // Align the element to the top of the container
        });
      }
    }
  }, [selectedStore]);

  return (
    <div className='w-1/4 p-4 overflow-y-auto bg-sg-light-green shadow-xl z-10'>
      <h2 className='text-sg-green text-xl font-bold mb-4'>
        Stores nearby: {stores.length}
      </h2>

      {stores.map((store) => {
        const isSelected =
          store.properties.name === selectedStore?.properties.name;
        return (
          <div
            key={store.properties.name}
            ref={(el) => {
              storeRefs.current[store.properties.name] = el;
            }}
            onClick={() => onSelectedStore(store)}
            className={`${isSelected ? 'bg-white' : 'bg-transparent'} hover:bg-white/50 relative flex flex-col my-4 border border-sg-green rounded-lg transition-all duration-200 cursor-pointer p-4`}>
            <h4 className='mb-2 text-sg-green text-xl font-semibold'>
              {store.properties.name}
            </h4>
            <div className='text-sg-green leading-normal font-light'>
              <div>
                <span className='font-bold text-sm'>Address: </span>
                {store.properties.address}
              </div>
              <div>
                <span className='font-bold text-sm'>Phone: </span>
                {store.properties.phoneFormatted}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
