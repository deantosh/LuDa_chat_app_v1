import React, { useState } from 'react';

const LoginOrSignup = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div style={styles.container}>
            {isLogin ? <LoginForm toggleForm={toggleForm} /> : <SignupForm toggleForm={toggleForm} />}
        </div>
    );
};

const LoginForm = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
            } else {
                console.error('Login failed:', await response.text());
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.heading}>Login</h2>
            <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <button type="submit" style={styles.button}>Login</button>
            <p style={styles.toggleText}>
                Not a user? <span onClick={toggleForm} style={styles.toggleLink}>Sign up here</span>.
            </p>
        </form>
    );
};

const SignupForm = ({ toggleForm }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Signup successful:', data);
            } else {
                console.error('Signup failed:', await response.text());
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.heading}>Sign Up</h2>
            <div style={styles.inputGroup}>
                <label htmlFor="username" style={styles.label}>Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.inputGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    required
                />
            </div>
            <button type="submit" style={styles.button}>Sign Up</button>
            <p style={styles.toggleText}>
                Already a user? <span onClick={toggleForm} style={styles.toggleLink}>Login here</span>.
            </p>
        </form>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        marginBottom: '15px',
        fontSize: '1.5rem',
        textAlign: 'center',
        color: '#333',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '0.9rem',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        color: "black",
        backgroundColor: "white",
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: '#fff',
        cursor: 'pointer',
    },
    toggleText: {
        marginTop: '15px',
        fontSize: '0.9rem',
        textAlign: 'center',
        color: '#555',
    },
    toggleLink: {
        color: '#007BFF',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default LoginOrSignup;
