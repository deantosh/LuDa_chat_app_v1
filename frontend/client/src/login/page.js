import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginOrSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div style={styles.container}>
      {isLogin ? (
        <LoginForm toggleForm={toggleForm} />
      ) : (
        <SignupForm toggleForm={toggleForm} />
      )}
    </div>
  );
};

const LoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValidEmail(email)) {
    setMessage("Invalid email address.");
    return;
  }

  if (password.length < 5) {
    setMessage("Password must be at least 6 characters long.");
    return;
  }

  try {
    const authHeader = "Basic " + btoa(`${email}:${password}`);
    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setMessage("Login successful."); // Display the message immediately
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Introduce a 1-second delay
      navigate('/account'); // Navigate after the delay
    } else {
      setMessage("Login failed: " + await response.text());
    }
  } catch (error) {
    setMessage("An error occurred: " + error.message);
  }
};

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Login</h2>
      {message && <p style={{ ...styles.message, color: message.includes("successful") ? "green" : "red" }}>{message}</p>}
      <div style={styles.inputGroup}>
        <label htmlFor="email" style={styles.label}>
          Email:
        </label>
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
        <label htmlFor="password" style={styles.label}>
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <button type="submit" style={styles.button}>
        Login
      </button>
      <p style={styles.toggleText}>
        Not a user?{" "}
        <span onClick={toggleForm} style={styles.toggleLink}>
          Sign up here
        </span>
        .
      </p>
    </form>
  );
};

const SignupForm = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage("Invalid email address.");
      return;
    }

    if (password.length < 5) {
      setMessage("Password must be at least 5 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        setMessage("Signup successful.");
      } else {
        setMessage("Signup failed: " + await response.text());
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Sign Up</h2>
      {message && <p style={{ ...styles.message, color: message.includes("successful") ? "green" : "red" }}>{message}</p>}
      <div style={styles.inputGroup}>
        <label htmlFor="username" style={styles.label}>
          Username:
        </label>
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
        <label htmlFor="email" style={styles.label}>
          Email:
        </label>
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
        <label htmlFor="password" style={styles.label}>
          Password:
        </label>
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
        <label htmlFor="confirmPassword" style={styles.label}>
          Confirm Password:
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <button type="submit" style={styles.button}>
        Sign Up
      </button>
      <p style={styles.toggleText}>
        Already a user?{" "}
        <span onClick={toggleForm} style={styles.toggleLink}>
          Login here
        </span>
        .
      </p>
    </form>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "15px",
    fontSize: "1.5rem",
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "0.9rem",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    color: "black",
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
  toggleText: {
    marginTop: "15px",
    fontSize: "0.9rem",
    textAlign: "center",
    color: "#555",
  },
  toggleLink: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
  message: {
    marginBottom: "15px",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};

export default LoginOrSignup;

