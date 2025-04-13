import React, { useState } from 'react';
import styles from './LoginPage.module.scss';
import { useNavigate } from 'react-router-dom'; // якщо ти використовуєш react-router

interface LoginResponse {
    token: string;
}

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // хук для навігації

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Імʼя користувача та пароль обовʼязкові!');
            return;
        }

        setLoading(true);
        const userData = { username, password };

        try {
            const response = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data: LoginResponse = await response.json();
            localStorage.setItem('token', data.token);
            setMessage('Успішний вхід!');
            // Переходиш на головну або дашборд
            setTimeout(() => navigate('/'), 1000);
        } catch (error: any) {
            setMessage(error.message || 'Помилка входу');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate("/")}
            >
                ← Назад
            </button>

            <form className={styles.loginForm} onSubmit={handleLogin}>
                <h2>Вхід</h2>

                <div className={styles.inputGroup}>
                    <label>Імʼя користувача</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ваше імʼя"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ваш пароль"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Вхід...' : 'Увійти'}
                </button>

                {message && <p className={styles.message}>{message}</p>}

                <div className={styles.links} >
                    <p className={styles.registerLink}>
                        Немає акаунту?{' '}
                        <span className={styles.registerText} onClick={() => navigate('/register')}>
                            Зареєструватися
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
