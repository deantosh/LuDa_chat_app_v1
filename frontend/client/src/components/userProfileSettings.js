import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import "../styles/userSettings.css";
import { UserContext } from "../dashboard/page"; 

const ProfileForm = () => {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState({
    username: "",
    avatar: "",
    bio: "",
    status: "Available", // Default value
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
        status: user.status || "Available",
      });
      setLoading(false);
    }
  }, [user]);

  // Handle profile updates
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/update", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(profile),
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-form">
      <h2>Edit Profile</h2>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Avatar</label>
        <div className="image-preview">
          <img
            src={profile.avatar || "/placeholder.jpg"}
            alt="Profile Avatar"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfile({ ...profile, avatar: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        ></textarea>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          value={profile.status}
          onChange={(e) => setProfile({ ...profile, status: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Away">Away</option>
        </select>
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
  );
};

export default ProfileForm;
