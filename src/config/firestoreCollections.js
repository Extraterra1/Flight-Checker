const DEFAULT_FLIGHTS_COLLECTION = 'flights_preview';

export const resolveFlightsCollectionName = (env = import.meta.env ?? {}) => {
  const configuredValue = String(env.VITE_FIREBASE_FLIGHTS_COLLECTION || '').trim();
  return configuredValue || DEFAULT_FLIGHTS_COLLECTION;
};

export const FLIGHTS_COLLECTION = resolveFlightsCollectionName();
