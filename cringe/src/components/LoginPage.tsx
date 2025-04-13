import React, { useState } from 'react';

interface LoginResponse {
    token: string;
}

const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('Username and password are required!');
            return;
        }

        setLoading(true);
        const userData = { username, password, role };

        try {
            fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    alert(response.status)
                    if (!response.ok) {
                        return response.text().then((text) => {
                            throw new Error(text || 'Login failed');
                        });
                    }
                    return response.json();
                })
                .then((data: LoginResponse) => {
                    localStorage.setItem('token', data.token);
                    setMessage('Login successful!');
                })
                .catch((error) => {
                    console.error('Error during login:', error.message);
                    setMessage('Login failed! Please check your username and password.');
                });
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Login failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;
