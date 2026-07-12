const OWNER_AUTH_KEY = 'stayora-owner-auth';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const storeOwnerSession = (owner) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OWNER_AUTH_KEY, JSON.stringify(owner));
  }
};

export const getOwnerSession = () => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(OWNER_AUTH_KEY);
  return stored ? safeParse(stored, null) : null;
};

const extractAuthToken = (session) => {
  if (!session) return null;

  const possibleTokenPaths = [
    session.token,
    session.accessToken,
    session.authResponse?.token,
    session.authResponse?.accessToken,
    session.authResponse?.data?.token,
    session.authResponse?.data?.accessToken,
    session.data?.token,
    session.data?.accessToken,
  ];

  const token = possibleTokenPaths.find((value) => typeof value === 'string' && value.trim());
  if (!token) return null;

  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

export const getOwnerToken = () => {
  const session = getOwnerSession();
  return extractAuthToken(session);
};

export const isOwnerAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!window.localStorage.getItem(OWNER_AUTH_KEY);
};

export const signInOwner = async (email, password) => {
  if (typeof window === 'undefined') return { success: false, message: 'Client authentication only.' };

  try {
    const response = await fetch('/api/owner/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password })
    });

    const data = await response.json();
    if (!response.ok || !data?.success) {
      return { success: false, message: data?.message || 'Invalid email or password.' };
    }

    const rawOwner = data.data?.user || data.data || { email };
    const owner = {
      ...rawOwner,
      authResponse: data,
      _id: rawOwner._id || rawOwner.id || rawOwner.user_id || rawOwner.userId,
      user_id: rawOwner.user_id || rawOwner._id || rawOwner.id || rawOwner.userId
    };
    storeOwnerSession(owner);
    return { success: true, user: owner };
  } catch (error) {
    return { success: false, message: 'Unable to login. Please try again.' };
  }
};

export const registerOwner = async ({ name, email, phone, college, password }) => {
  if (typeof window === 'undefined') return { success: false, message: 'Client registration only.' };

  if (!name || !email || !phone || !college || !password) {
    return { success: false, message: 'Name, Email, Phone, College and Password are required' };
  }

  try {
    const response = await fetch('/api/owner/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), college: college.trim(), password })
    });

    const data = await response.json();
    if (!response.ok || !data?.success) {
      return { success: false, message: data?.message || 'Unable to register owner.' };
    }

    const rawOwner = data.data?.user || data.data || { email, name };
    const owner = {
      ...rawOwner,
      _id: rawOwner._id || rawOwner.id || rawOwner.user_id || rawOwner.userId,
      user_id: rawOwner.user_id || rawOwner._id || rawOwner.id || rawOwner.userId,
      name: rawOwner.name || rawOwner.fullName || rawOwner.username,
      email: rawOwner.email || rawOwner.userEmail
    };
    storeOwnerSession(owner);
    return { success: true, user: owner };
  } catch (error) {
    return { success: false, message: 'Unable to register. Please try again.' };
  }
};

export const signOutOwner = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(OWNER_AUTH_KEY);
  }
};
