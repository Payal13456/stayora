import { AUTH_API_URL } from '../../../lib/apiConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: data?.message || 'Login failed' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying owner login:', error);
    return res.status(500).json({ success: false, message: 'Unable to login right now.' });
  }
}
