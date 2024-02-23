import React, { useEffect } from 'react';
import { useAuth } from './useAuth';

interface LoginFormProps {
  onSuccessfulLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccessfulLogin }) => {
  const { login, loginError, loggedInUser } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    await login(email, password);
  };

  useEffect(() => {
    if (loggedInUser) {
      onSuccessfulLogin();
    }
  }, [loggedInUser, onSuccessfulLogin]);

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="johndoe@gmail.com"
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      {loginError && <p className="text-red-500 text-sm mb-5">{loginError}</p>}

      <button
        onClick={handleSubmit}
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};
