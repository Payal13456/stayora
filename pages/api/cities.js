export default async function handler(req, res) {
  try {
    const response = await fetch('https://stayora-backend.onrender.com/cities');

    if (!response.ok) {
      const message = `Backend cities request failed with status ${response.status}`;
      return res.status(response.status).json({ success: false, message });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying cities request:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch cities.' });
  }
}
