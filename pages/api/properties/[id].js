import { PROPERTIES_API_URL } from '../../../lib/apiConfig';

export default async function handler(req, res) {
  try {

    const response = await fetch('https://stayora-backend.onrender.com/properties'+'/'+req.query.id, {
      timeout: 5000
    });

    console.log(response, "response********");

    if (!response.ok) {
      console.warn(`Backend properties request failed with status ${response.status}, using mock data`);
      // Use mock data as fallback
      const properties = [];
      
      return res.status(200).json({
        success: true,
        data: [],
        count: 0,
        id : req.query.id
      });
    }

    const data = await response.json();
    const properties = data.data


    return res.status(200).json({
      ...data,
      data: properties,
      id : req.query.id
    });
  } catch (error) {
    console.error('Error proxying properties request:', error.message);
    return res.status(500).json({
      success: true,
      data: [],
      count: 0,
      id : req.query.id
    });
  }
}
