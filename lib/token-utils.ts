export function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getUserRole(token: string | null): string | null {
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  // ASP.NET Core Role claim type
  return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || null;
}
