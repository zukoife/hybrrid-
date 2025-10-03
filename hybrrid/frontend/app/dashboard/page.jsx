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
        setError(err?.message || 'Failed to load user');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
        {loading && (
          <div className="text-gray-600">Loading...</div>
        )}

        {!loading && error && (
          <div>
            <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        )}

        {!loading && !error && (
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-black"
              >
                Log out
              </button>
            </div>
            {user && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium text-gray-900 break-all">{user.id}</p>
                </div>
                <div className="rounded border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{user.name || '—'}</p>
                </div>
                <div className="rounded border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 break-all">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
