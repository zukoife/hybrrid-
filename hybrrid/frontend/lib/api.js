export const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (isJson && data && data.error) ? data.error : (typeof data === 'string' ? data : 'Request failed');
    throw new Error(message);
  }
  return data;
}

export async function signup(userData) {
  const res = await fetch(`${BACKEND}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function login(credentials) {
  const res = await fetch(`${BACKEND}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

export async function me(token) {
  const res = await fetch(`${BACKEND}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}
