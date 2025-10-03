"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { me } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          router.replace('/login');
          return;
        }
        const data = await me(token);
        setUser(data);
      } catch (err) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  }

  if (loading) {
    return <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>
        <p style={{ color: 'crimson' }}>{error}</p>
        <button onClick={() => router.push('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name || '—'}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}
