export function useAuth() {
  async function login(email: string, password: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      const user = await response.json();
      localStorage.setItem('token', user.accessToken);

      // notify other parts of the app that the user has logged in
      window.dispatchEvent(new Event('login'));

      return { user };
    } catch (error) {
      return { error: 'Login failed' };
    }
  }

  async function logout() {
    localStorage.removeItem('token');

    window.dispatchEvent(new Event('logout'));
  }

  async function getLoggedInUser() {
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
  }

  async function isUserLoggedIn() {
    const user = await getLoggedInUser();
    return user !== null;
  }

  return { login, isUserLoggedIn, logout, getLoggedInUser };
}
