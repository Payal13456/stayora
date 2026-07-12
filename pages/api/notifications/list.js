import { NOTIFICATIONS_API_URL } from '../../../lib/apiConfig';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authorization header missing' });
  }

  try {
    const response = await fetch(`${NOTIFICATIONS_API_URL}/list`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: data?.message || 'Failed to fetch notifications' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying notifications request:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch notifications.' });
  }
}
