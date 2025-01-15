import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./UserSettings.css";

const UserSettings = () => {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    email: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [preferences, setPreferences] = useState({
    notifications: true,
    sound: true,
    theme: "light",
  });

  // Apply theme dynamically
  useEffect(() => {
    document.body.className = preferences.theme;
  }, [preferences.theme]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePreferenceChange = (name) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("Settings saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="settings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header>
        <h1>User Settings</h1>
      </header>

      <div className="tabs">
        {["Profile", "Account", "Preferences"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
            whileHover={{ scale: 1.1 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={tabVariants}
        className="tab-content"
      >
        {activeTab === "Profile" && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <motion.div
                  className="image-preview"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={imagePreview} alt="Profile Preview" />
                </motion.div>
              )}
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                minLength="3"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                maxLength="160"
              />
            </div>
          </form>
        )}

        {activeTab === "Account" && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                minLength="6"
              />
            </div>
          </form>
        )}

        {activeTab === "Preferences" && (
          <div className="preferences">
            <div className="preference-item">
              <label>Email Notifications</label>
              <motion.div
                className="toggle"
                onClick={() => handlePreferenceChange("notifications")}
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div
                  className={`toggle-thumb ${
                    preferences.notifications ? "on" : "off"
                  }`}
                />
              </motion.div>
            </div>

            <div className="preference-item">
              <label>Sound for New Messages</label>
              <motion.div
                className="toggle"
                onClick={() => handlePreferenceChange("sound")}
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div
                  className={`toggle-thumb ${preferences.sound ? "on" : "off"}`}
                />
              </motion.div>
            </div>

            <div className="preference-item">
              <label>Chat Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) =>
                  setPreferences({ ...preferences, theme: e.target.value })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        )}
      </motion.div>

      <button className="save-btn" onClick={handleSubmit}>
        Save Settings
      </button>

      {successMessage && <div className="toast">{successMessage}</div>}
    </motion.div>
  );
};

export default UserSettings;
