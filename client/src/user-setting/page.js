import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import '../styles/UserSettings.css'

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
  });
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/me");
        const data = await response.json();
        setProfile(data.profile);
        setPreferences(data.preferences);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle profile updates
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile, preferences }),
      });

      if (response.ok) {
        setToast("Profile updated successfully!");
      } else {
        setToast("Failed to update profile.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setToast("An error occurred while saving.");
    }

    // Clear the toast after a few seconds
    setTimeout(() => setToast(""), 3000);
  };

  // Handle preference toggles
  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`settings-container ${preferences.darkMode ? "dark" : "light"}`}>
      <header>
        <h1>User Settings</h1>
      </header>

      <div className="tabs">
        <button className="active">Profile</button>
        <button>Preferences</button>
      </div>

      <div className="tab-content">
        <div className="form-group">
          <label>Profile Picture</label>
          <div className="image-preview">
            <img src={profile.profilePicture || "/placeholder.jpg"} alt="Profile" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfile((prev) => ({ ...prev, profilePicture: reader.result }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
          ></textarea>
        </div>

        <div className="preferences">
          <div className="preference-item">
            <span>Dark Mode</span>
            <div
              className={`toggle ${preferences.darkMode ? "on" : "off"}`}
              onClick={() => togglePreference("darkMode")}
            >
              <div className={`toggle-thumb ${preferences.darkMode ? "on" : "off"}`} />
            </div>
          </div>

          <div className="preference-item">
            <span>Notifications</span>
            <div
              className={`toggle ${preferences.notifications ? "on" : "off"}`}
              onClick={() => togglePreference("notifications")}
            >
              <div className={`toggle-thumb ${preferences.notifications ? "on" : "off"}`} />
            </div>
          </div>
        </div>

        <motion.button
          className="save-btn"
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Changes
        </motion.button>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
};

export default Settings;
