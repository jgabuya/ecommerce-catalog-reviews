import { useState } from 'react';
import { User } from './types';
import { useCallback, useEffect } from 'react';

export function useAuth() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoginError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      const user = await response.json();
      setLoggedInUser(user);
      localStorage.setItem('token', user.accessToken);

      // notify other parts of the app that the user has logged in
      window.dispatchEvent(new Event('login'));
    } catch (error) {
      setLoginError('Failed to login');
      console.error(error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');

    window.dispatchEvent(new Event('logout'));
  }, []);

  const getLoggedInUser = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const user = await response.json();
      return user;
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('login', async () => {
      const user = await getLoggedInUser();
      setLoggedInUser(user);
    });

    window.addEventListener('logout', () => {
      setLoggedInUser(null);
    });
  }, [getLoggedInUser]);

  useEffect(() => {
    getLoggedInUser().then(user => {
      setLoggedInUser(user);
    });
  }, [getLoggedInUser]);

  return { login, loggedInUser, loginError, logout, getLoggedInUser };
}
