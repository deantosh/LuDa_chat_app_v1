import React from 'react';

const Sidebar = () => {
    return (
        <div style={styles.sidebar}>
            <h2 style={styles.heading}>LuDa Chat</h2>
            <nav style={styles.navMenu}>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <button style={styles.navButton}>
                            <span style={styles.icon}>📂</span>
                            Groups
                        </button>
                    </li>
                    <li style={styles.navItem}>
                        <button style={styles.navButton}>
                            <span style={styles.icon}>👥</span>
                            Friends
                        </button>
                    </li>
                    <li style={styles.navItem}>
                        <button style={styles.navButton}>
                            <span style={styles.icon}>⚙️</span>
                            Settings
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '1.5rem',
        marginBottom: '20px',
        fontWeight: 'bold',
    },
    navMenu: {
        width: '100%',
    },
    navList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    navItem: {
        marginBottom: '15px',
    },
    navButton: {
        width: '100%',
        padding: '10px 15px',
        fontSize: '1rem',
        color: '#ecf0f1',
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    navButtonHover: {
        backgroundColor: '#34495e',
    },
    icon: {
        fontSize: '1.2rem',
    },
};

export default Sidebar;
