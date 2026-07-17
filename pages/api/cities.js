// Mock cities data as fallback
const mockCities = [
  {
    id: 1,
    name: "Delhi",
    image:
      "https://images.unsplash.com/photo-1518324305472-9ee6faf8c3ca?w=500&h=400&fit=crop",
    count: 245,
  },
  {
    id: 2,
    name: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=500&h=400&fit=crop",
    count: 189,
  },
  {
    id: 3,
    name: "Bangalore",
    image:
      "https://images.unsplash.com/photo-1596178065887-8f3341f2f8ce?w=500&h=400&fit=crop",
    count: 267,
  },
  {
    id: 4,
    name: "Pune",
    image:
      "https://images.unsplash.com/photo-1583707802411-783342ed5af2?w=500&h=400&fit=crop",
    count: 156,
  },
  {
    id: 5,
    name: "Hyderabad",
    image:
      "https://images.unsplash.com/photo-1570314174210-e323f43e5fa5?w=500&h=400&fit=crop",
    count: 198,
  },
  {
    id: 6,
    name: "Chennai",
    image:
      "https://images.unsplash.com/photo-1596178065887-8f3341f2f8ce?w=500&h=400&fit=crop",
    count: 142,
  },
];

export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.myhomivo.com//cities", {
      timeout: 5000,
    });

    if (!response.ok) {
      console.warn(
        `Backend cities request failed with status ${response.status}, using mock data`
      );
      return res.status(200).json({ success: true, data: mockCities });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error proxying cities request:", error.message);
    // Return mock data as fallback instead of error
    return res.status(200).json({ success: true, data: mockCities });
  }
}
