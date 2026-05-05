export const ADMIN_STORAGE_KEY = 'stayora-admin-auth';

export const isAdminAuthenticated = () => {
  return typeof window !== 'undefined' && localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
};

export const signInAdmin = (username, password) => {
  const isValid = username === 'admin' && password === 'password123';
  if (typeof window !== 'undefined' && isValid) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  }
  return isValid;
};

export const signOutAdmin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
};
