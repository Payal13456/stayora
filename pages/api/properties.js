import { PROPERTIES_API_URL } from '../../lib/apiConfig';

// Mock properties data as fallback
const mockProperties = [
  {
    id: 1,
    title: 'Modern PG in South Delhi',
    type: 'PG',
    address: 'South Delhi, Delhi',
    price: 8500,
    genderPreference: 'Female',
    description: 'Fully furnished PG with all amenities',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    city: { _id: '1', name: 'Delhi' }
  },
  {
    id: 2,
    title: 'Cozy Flat in Whitefield',
    type: 'FLAT',
    address: 'Whitefield, Bangalore',
    price: 15000,
    genderPreference: 'Any',
    description: '1BHK flat with parking and gym',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    city: { _id: '3', name: 'Bangalore' }
  },
  {
    id: 3,
    title: 'Hostel near Marine Drive',
    type: 'HOSTEL',
    address: 'Marine Drive, Mumbai',
    price: 6000,
    genderPreference: 'Male',
    description: 'Budget hostel with shared rooms',
    image: 'https://images.unsplash.com/photo-1631049307038-da5ec5d4e406?w=500&h=400&fit=crop',
    city: { _id: '2', name: 'Mumbai' }
  },
  {
    id: 4,
    title: 'Premium PG in Koramangala',
    type: 'PG',
    address: 'Koramangala, Bangalore',
    price: 12000,
    genderPreference: 'Female',
    description: 'Premium PG with kitchen access',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    city: { _id: '3', name: 'Bangalore' }
  },
  {
    id: 5,
    title: 'Apartment near FC Road',
    type: 'FLAT',
    address: 'FC Road, Pune',
    price: 10000,
    genderPreference: 'Any',
    description: '2BHK flat near college',
    image: 'https://images.unsplash.com/photo-1460932523989-75d0a8e22f4f?w=500&h=400&fit=crop',
    city: { _id: '4', name: 'Pune' }
  },
  {
    id: 6,
    title: 'PG in Jubilee Hills',
    type: 'PG',
    address: 'Jubilee Hills, Hyderabad',
    price: 9500,
    genderPreference: 'Female',
    description: 'Spacious PG with study rooms',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    city: { _id: '5', name: 'Hyderabad' }
  }
];

export default async function handler(req, res) {
  try {
    const response = await fetch(PROPERTIES_API_URL, {
      timeout: 5000
    });

    if (!response.ok) {
      console.warn(`Backend properties request failed with status ${response.status}, using mock data`);
      // Use mock data as fallback
      const properties = mockProperties;
      const filtered = filterProperties(properties, req.query);
      return res.status(200).json({
        success: true,
        data: filtered,
        count: filtered.length,
      });
    }

    const data = await response.json();
    const properties = Array.isArray(data?.data) ? data.data : [];
    const filtered = filterProperties(properties, req.query);

    return res.status(200).json({
      ...data,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    console.error('Error proxying properties request:', error.message);
    // Return mock data as fallback
    const filtered = filterProperties(mockProperties, req.query);
    return res.status(200).json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  }
}

function filterProperties(properties, queryParams) {
  const {
    city,
    type,
    genderPreference,
    minPrice,
    maxPrice,
  } = queryParams || {};

  const normalize = (value) => String(value || '').trim().toLowerCase();
  const cityFilter = String(city || '').trim();
  const typeFilter = normalize(type);
  const genderFilter = normalize(genderPreference);
  const minPriceNumber = minPrice === undefined || minPrice === '' ? null : Number(minPrice);
  const maxPriceNumber = maxPrice === undefined || maxPrice === '' ? null : Number(maxPrice);

  const filtered = properties.filter((property) => {
    const propertyCityId = String(property?.city?._id || '').trim();
    const propertyCity = normalize(property?.city?.name);
    const propertyAddress = normalize(property?.address);
    const propertyType = normalize(property?.type);
    const propertyGender = normalize(property?.genderPreference);
    const propertyPrice = Number(property?.price);

    const matchesCity = !cityFilter || propertyCityId === cityFilter || propertyCity.includes(normalize(cityFilter)) || propertyAddress.includes(normalize(cityFilter));
    const matchesType = !typeFilter || propertyType === typeFilter;
    const matchesGender = !genderFilter || propertyGender === genderFilter;
    const matchesMinPrice = minPriceNumber === null || Number.isNaN(minPriceNumber) || propertyPrice >= minPriceNumber;
    const matchesMaxPrice = maxPriceNumber === null || Number.isNaN(maxPriceNumber) || propertyPrice <= maxPriceNumber;

    return matchesCity && matchesType && matchesGender && matchesMinPrice && matchesMaxPrice;
  });

  return filtered;
}
