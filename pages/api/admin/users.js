const INITIAL_USERS = [
  { id: 1, name: 'Arjun Singh', email: 'arjun@example.com', role: 'Owner' },
  { id: 2, name: 'Nisha Patel', email: 'nisha@example.com', role: 'Tenant' }
];

export default async function handler(req, res) {
  try {
    const response = await fetch('https://stayora-backend.onrender.com/student/all', {
      timeout: 5000
    });

    if (!response.ok) {
      console.warn(`Backend user request failed with status ${response.status}, using mock data`);
      return res.status(200).json({ success: true, data: INITIAL_USERS });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying cities request:', error.message);
    // Return mock data as fallback instead of error
    return res.status(200).json({ success: true, data: INITIAL_USERS });
  }
}
