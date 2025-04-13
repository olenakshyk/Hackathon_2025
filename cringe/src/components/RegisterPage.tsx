import React, { useState } from 'react';
import styles from './LoginPage.module.scss';
import { useNavigate } from 'react-router-dom';

interface RegisterResponse {
  message: string;
}

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Username and password are required!');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const userData = { username, password, role: 'USER' };

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: RegisterResponse = await response.json();
      setMessage(data.message || 'Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      setMessage(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        ← Назад
      </button>

      <form className={styles.loginForm} onSubmit={handleRegister}>
        <h2>Реєстрація</h2>

        <div className={styles.inputGroup}>
          <label>Ім'я користувача</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ім'я користувача"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Реєстрація...' : 'Зараєструватись'}
        </button>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.links}>
          <p className={styles.registerLink}>
            Вже маєш акаунт?{' '}
            <span
              className={styles.registerText}
              onClick={() => navigate('/login')}
            >
              Ввійти в акаунт
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
