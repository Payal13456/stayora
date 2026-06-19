// Mock roommates data as fallback
const mockRoommates = [
  {
    id: 1,
    name: 'Priya Sharma',
    age: 22,
    role: 'Student',
    bio: 'Engineering student, love reading and sports',
    location: 'Delhi',
    budget: 8000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    age: 23,
    role: 'Professional',
    bio: 'Software developer, into tech and music',
    location: 'Bangalore',
    budget: 12000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
  },
  {
    id: 3,
    name: 'Amit Patel',
    age: 21,
    role: 'Student',
    bio: 'Medical student, fitness enthusiast',
    location: 'Mumbai',
    budget: 10000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
  },
  {
    id: 4,
    name: 'Neha Singh',
    age: 22,
    role: 'Student',
    bio: 'MBA aspirant, loves cooking and travel',
    location: 'Pune',
    budget: 9000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'
  },
  {
    id: 5,
    name: 'Vikram Desai',
    age: 24,
    role: 'Professional',
    bio: 'Data analyst, cinema lover',
    location: 'Hyderabad',
    budget: 11000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram'
  }
];

export default async function handler(req, res) {
  try {
    const response = await fetch('https://stayora-backend.onrender.com/roommate', {
      timeout: 5000
    });

    if (!response.ok) {
      console.warn(`Backend roommate request failed with status ${response.status}, using mock data`);
      return res.status(200).json({ success: true, data: mockRoommates });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying roommate request:', error.message);
    // Return mock data as fallback instead of error
    return res.status(200).json({ success: true, data: mockRoommates });
  }
}
