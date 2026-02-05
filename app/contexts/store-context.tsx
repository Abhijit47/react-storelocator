import { createContext, useContext, useState } from 'react';
import { storeLocations } from '~/constants';

type StoreContextType = {
  stores: StoreFeature[];
  selectedStore: StoreFeature | null;
  onSelectedStore: (store: StoreFeature | null) => void;
};

export const StoreContext = createContext({} as StoreContextType);

export function StoreContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const stores = storeLocations;

  const [selectedStore, setSelectedStore] = useState<StoreFeature | null>(null);

  function handleSetSelectedStore(store: StoreFeature | null) {
    setSelectedStore(store);
  }

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        onSelectedStore: handleSetSelectedStore,
      }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      'useStoreContext must be used within a StoreContextProvider',
    );
  }

  return context;
}
