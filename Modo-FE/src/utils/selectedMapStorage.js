const SELECTED_MAP_KEY = 'selectedMapState';
const MAP_SELECTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const VALID_LOCATION_TYPES = new Set(['dungeon', 'gorge', 'castle', 'room']);

export function saveSelectedMap(locationType) {
  if (!VALID_LOCATION_TYPES.has(locationType)) return;
  const expiresAt = Date.now() + MAP_SELECTION_TTL_MS;
  const payload = { locationType, expiresAt };
  localStorage.setItem(SELECTED_MAP_KEY, JSON.stringify(payload));
}

export function getSelectedMap() {
  try {
    const raw = localStorage.getItem(SELECTED_MAP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const locationType = parsed?.locationType;
    const expiresAt = Number(parsed?.expiresAt);

    if (!VALID_LOCATION_TYPES.has(locationType) || !Number.isFinite(expiresAt)) {
      localStorage.removeItem(SELECTED_MAP_KEY);
      return null;
    }

    if (Date.now() > expiresAt) {
      localStorage.removeItem(SELECTED_MAP_KEY);
      return null;
    }

    return locationType;
  } catch {
    localStorage.removeItem(SELECTED_MAP_KEY);
    return null;
  }
}