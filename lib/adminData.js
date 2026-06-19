const USER_STORAGE_KEY = 'stayora-admin-users';
const PROPERTY_STORAGE_KEY = 'stayora-admin-properties';

const INITIAL_USERS = [
  { id: 1, name: 'Arjun Singh', email: 'arjun@example.com', role: 'Owner' },
  { id: 2, name: 'Nisha Patel', email: 'nisha@example.com', role: 'Tenant' }
];

const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: 'Sunshine Girls PG',
    type: 'PG',
    location: 'Vijay Nagar, Indore',
    price: 6500,
    gender: 'Female',
    owner: 'arjun@example.com',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
    ],
    videos: ['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm']
  },
  {
    id: 2,
    title: 'Spacious 2BHK Near Campus',
    type: 'Flat',
    location: 'Bhawarkua, Indore',
    price: 12000,
    gender: 'Any',
    owner: 'nisha@example.com',
    images: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
    ],
    videos: []
  }
];

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

export const getUsers = () => {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const stored = window.localStorage.getItem(USER_STORAGE_KEY);
  return stored ? safeParse(stored, INITIAL_USERS) : INITIAL_USERS;
};

export const setUsers = (users) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }
  return users;
};

export const addUser = (user) => {
  const items = getUsers();
  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  return setUsers([...items, { id: nextId, ...user }]);
};

export const updateUser = (updated) => {
  const items = getUsers();
  return setUsers(items.map((item) => (item.id === updated.id ? updated : item)));
};

export const deleteUser = (id) => {
  const items = getUsers();
  return setUsers(items.filter((item) => item.id !== id));
};

export const getProperties =async () => {
  const response = await fetch(`/api/properties`);
  console.log('Fetched properties from API', response);
  if (!response.ok) {
    console.warn(`Failed to fetch properties with status ${response.status}, using local data`);
    return INITIAL_PROPERTIES;
  }
  const data = await response.json();
  return Array.isArray(data?.data) ? data.data : INITIAL_PROPERTIES;
};

export const getPropertyById =async (id) => {
  const response = await fetch(`/api/properties`);
  console.log('Fetched properties from API', response);
  if (!response.ok) {
    console.warn(`Failed to fetch properties with status ${response.status}, using local data`);
    return INITIAL_PROPERTIES;
  }
  const properties = await response.json();
  const items = Array.isArray(properties?.data) ? properties.data : INITIAL_PROPERTIES;
  return items.find((item) => String(item.id) === String(id));
};

export const setProperties = (items) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify(items));
  }
  return items;
};

export const addProperty = (property) => {
  const items = getProperties();
  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  return setProperties([...items, { id: nextId, ...property }]);
};

export const updateProperty = (updated) => {
  const items = getProperties();
  return setProperties(items.map((item) => (item.id === updated.id ? updated : item)));
};

export const deleteProperty = (id) => {
  const items = getProperties();
  return setProperties(items.filter((item) => item.id !== id));
};
