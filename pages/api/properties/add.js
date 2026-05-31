export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://stayora-backend.onrender.com/properties/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ success: false, message: error.message || 'Failed to add property' });
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error adding property:', error);
    return res.status(500).json({ success: false, message: 'Unable to add property.' });
  }
}
