import axios from 'axios';

const MADEIRA_TIMEZONE = 'Atlantic/Madeira';
const DEFAULT_FR24_API_BASE_URL = 'https://fr-24-scraper.vercel.app';
const DEFAULT_FR24_AIRPORT = 'FNC';
const DEFAULT_BATCH_SIZE = 25;

const LEGACY_ICAO_TO_IATA_PREFIX = {
  WMT: 'W4',
  MBU: 'DI',
  JAF: 'TB',
  '4Y*': '4Y',
  'D8*': 'D8'
};

const normalizeFlightInput = (value) =>
  String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const createClientError = (code, message, cause) => {
  const error = new Error(message);
  error.code = code;
  if (cause) error.cause = cause;
  return error;
};

const buildNotFoundResult = (flightNumber) => ({
  flightNumber,
  lookupState: 'not_found',
  status: 'unknown',
  error: {
    code: 'NOT_FOUND_IN_AIRPORT_SNAPSHOT',
    message: 'Flight not found for airport/date snapshot.'
  }
});

export const resolveApiKey = (env = import.meta.env ?? {}) => String(env.VITE_FR24_API_KEY ?? env.VITE_API_KEY ?? '').trim();

const getRuntimeConfig = () => {
  const env = import.meta.env ?? {};
  return {
    apiBaseUrl: String(env.VITE_FR24_API_BASE_URL || DEFAULT_FR24_API_BASE_URL).replace(/\/+$/, ''),
    apiKey: resolveApiKey(env),
    airport: String(env.VITE_FR24_AIRPORT || DEFAULT_FR24_AIRPORT).toUpperCase()
  };
};

export const getTodayMadeiraDate = (now = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: MADEIRA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  if (year && month && day) return `${year}-${month}-${day}`;
  return now.toISOString().slice(0, 10);
};

export const normalizeStatus = (rawStatus) => {
  const value = String(rawStatus || '').toLowerCase();
  switch (value) {
    case 'scheduled':
      return 'Scheduled';
    case 'departed':
      return 'Departed';
    case 'landed':
      return 'Arrived';
    case 'unknown':
      return 'Unknown';
    default:
      return value ? `${value[0].toUpperCase()}${value.slice(1)}` : 'Unknown';
  }
};

export const formatArrival = (result) => {
  const arrivalTime = result?.arrivalTime;
  const rawUtc = arrivalTime?.selectedUtc || arrivalTime?.estimatedUtc || arrivalTime?.scheduledUtc;
  if (!rawUtc) return 'N/A';

  const value = new Date(rawUtc);
  if (Number.isNaN(value.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: MADEIRA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(value);
};

export const resolveFlightNumber = (flight) => {
  const explicit = normalizeFlightInput(flight?.flightNumber);
  if (explicit) return explicit;

  const icao = String(flight?.icao || '')
    .toUpperCase()
    .trim();
  const number = String(flight?.number || '')
    .toUpperCase()
    .trim();
  if (!icao || !number) return '';

  const normalizedPrefix = LEGACY_ICAO_TO_IATA_PREFIX[icao] || icao.replace(/\*/g, '');
  return normalizeFlightInput(`${normalizedPrefix}${number}`);
};

export const chunkFlightNumbers = (flightNumbers, batchSize = DEFAULT_BATCH_SIZE) => {
  const unique = [...new Set((flightNumbers || []).map((value) => normalizeFlightInput(value)).filter(Boolean))];
  const chunks = [];
  for (let i = 0; i < unique.length; i += batchSize) {
    chunks.push(unique.slice(i, i + batchSize));
  }
  return chunks;
};

export const fetchBatchFlightStatus = async (flightNumbers) => {
  const { apiBaseUrl, apiKey, airport } = getRuntimeConfig();

  if (!apiKey) {
    throw createClientError('MISSING_API_KEY', 'Missing VITE_FR24_API_KEY.');
  }

  const chunks = chunkFlightNumbers(flightNumbers, DEFAULT_BATCH_SIZE);
  if (chunks.length === 0) {
    return {
      resultsByFlight: new Map(),
      failedByFlight: new Map()
    };
  }

  const requests = chunks.map((chunk) =>
    axios
      .post(
        `${apiBaseUrl}/api/flights/status`,
        {
          flightNumbers: chunk,
          date: getTodayMadeiraDate(),
          airport
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          }
        }
      )
      .then((response) => ({ chunk, response }))
      .catch((error) => ({ chunk, error }))
  );

  const settled = await Promise.all(requests);
  const resultsByFlight = new Map();
  const failedByFlight = new Map();

  settled.forEach(({ chunk, response, error }) => {
    if (error) {
      chunk.forEach((flightNumber) => failedByFlight.set(flightNumber, error));
      return;
    }

    const apiResults = Array.isArray(response?.data?.results) ? response.data.results : [];
    apiResults.forEach((item) => {
      const itemFlightNumber = normalizeFlightInput(item?.flightNumber);
      if (!itemFlightNumber) return;
      resultsByFlight.set(itemFlightNumber, item);
    });

    chunk.forEach((flightNumber) => {
      if (!resultsByFlight.has(flightNumber)) {
        resultsByFlight.set(flightNumber, buildNotFoundResult(flightNumber));
      }
    });
  });

  return { resultsByFlight, failedByFlight };
};

export const fetchSingleFlightStatus = async (flightNumber) => {
  const normalized = normalizeFlightInput(flightNumber);
  if (!normalized) throw createClientError('INVALID_FLIGHT_NUMBER', 'Invalid flight number.');

  const { resultsByFlight, failedByFlight } = await fetchBatchFlightStatus([normalized]);
  if (failedByFlight.has(normalized)) throw failedByFlight.get(normalized);

  return resultsByFlight.get(normalized) || buildNotFoundResult(normalized);
};

export const getFr24ErrorMessage = (error) => {
  if (error?.code === 'MISSING_API_KEY') return 'FR24 API key is missing. Set VITE_FR24_API_KEY.';
  if (error?.code === 'INVALID_FLIGHT_NUMBER') return 'Please enter a valid flight number.';

  const apiCode = error?.response?.data?.error?.code;
  const apiMessage = error?.response?.data?.error?.message;

  if (apiCode === 'UNAUTHORIZED') return 'FR24 API authorization failed. Check VITE_FR24_API_KEY.';
  if (apiCode === 'RATE_LIMITED') return 'FR24 API rate limit reached. Please try again shortly.';
  if (apiCode === 'INVALID_REQUEST') return 'Invalid request sent to FR24 API.';
  if (apiMessage) return apiMessage;

  if (error?.response?.status >= 500) return 'FR24 API is temporarily unavailable. Please try again.';
  return error?.message || 'Unable to fetch flight data right now.';
};
