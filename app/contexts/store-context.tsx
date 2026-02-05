import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { storeLocations } from '~/constants';

type StoreContextType = {
  stores: StoreFeature[];
  selectedStore: StoreFeature | null;
  onSelectedStore: (store: StoreFeature | null) => void;
  isPopOverOpen: boolean;
  setIsPopOverOpen: Dispatch<SetStateAction<boolean>>;
};

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined,
);

export function StoreContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const stores = storeLocations;

  const [selectedStore, setSelectedStore] = useState<StoreFeature | null>(null);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  function handleSetSelectedStore(store: StoreFeature | null) {
    setSelectedStore(store);
    setIsPopOverOpen(true);
  }

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        onSelectedStore: handleSetSelectedStore,
        isPopOverOpen,
        setIsPopOverOpen,
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
