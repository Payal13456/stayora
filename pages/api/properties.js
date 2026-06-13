import { PROPERTIES_API_URL } from '../../lib/apiConfig';

export default async function handler(req, res) {
  try {
    const response = await fetch(PROPERTIES_API_URL);

    if (!response.ok) {
      const message = `Backend properties request failed with status ${response.status}`;
      return res.status(response.status).json({ success: false, message });
    }

    const data = await response.json();
    const properties = Array.isArray(data?.data) ? data.data : [];

    const {
      city,
      type,
      genderPreference,
      minPrice,
      maxPrice,
    } = req.query || {};

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

    return res.status(200).json({
      ...data,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    console.error('Error proxying properties request:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch properties.' });
  }
}
