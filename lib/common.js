export function storeTokenInLocalStorage(token) {
  localStorage.setItem('token', token);
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem('token');
}

export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  const token = getTokenFromLocalStorage();
  if (!token) {
    return defaultReturnObject;
  }
  return { authenticated: true, user: token };
}
