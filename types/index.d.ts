declare interface StoreFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    name: string;
    phoneFormatted: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
  };
}
