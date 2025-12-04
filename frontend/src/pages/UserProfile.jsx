import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Avatar,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function UserProfile() {
  const badges = ["20/21", "21/22", "22/23", "23/24"];

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [badge, setBadge] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  // Fetch current user profile
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);

      if (u) {
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setProfileExists(true);
          setName(data.name || "");
          setRegNo(data.regNo || "");
          setBadge(data.badge || "");
          setImagePreview(data.photoURL || "");
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Convert image to Base64
  const handleFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle --> file selection
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  // Handle -->  form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) return setError("You must be logged in.");
    if (profileExists) return setError("Profile is locked and cannot be edited.");
    if (!name.trim() || !regNo.trim() || !badge) return setError("Please fill all fields.");

    setSaving(true);

    try {
      let photoBase64 = "";

      if (imageFile) {
        try {
          photoBase64 = await handleFileToBase64(imageFile);
        } catch (err) {
          console.error("Image conversion failed:", err);
          setError("Failed to process profile photo.");
          setSaving(false);
          return;
        }
      }

      // Save --> profile data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        regNo: regNo.trim(),
        badge,
        photoURL: photoBase64, // image -->  Base64 stored directly
        createdAt: new Date(),
      });

      setProfileExists(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          maxWidth: 400,
          border: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={28} sx={{ color: "#667eea" }} />
      </Paper>
    );

  return (
    <>
      {profileExists ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            maxWidth: 600,
            boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              filter: "blur(60px)",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon /> Profile
              </Typography>
              <Chip
                icon={<CheckCircleIcon />}
                label="Verified"
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={imagePreview}
                  alt={name}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#4caf50",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid white",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 16, color: "white" }} />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                  <Chip
                    icon={<BadgeIcon sx={{ color: "white !important" }} />}
                    label={regNo}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "white",
                      fontWeight: 500,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Chip
                    icon={<CalendarTodayIcon sx={{ color: "white !important" }} />}
                    label={`Batch ${badge}`}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "white",
                      fontWeight: 500,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Box>
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "& .MuiAlert-icon": { color: "white" },
                  }}
                >
                  Profile is complete and locked for editing
                </Alert>
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #e0e0e0",
            background: "white",
            maxWidth: 500,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, color: "#1a1a1a" }}>
            Complete Your Profile
          </Typography>
          <Typography sx={{ mb: 3, color: "#666", fontSize: "0.95rem" }}>
            Fill in your details to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={imagePreview || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "3px dashed #e0e0e0",
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {!imagePreview && <PersonIcon sx={{ fontSize: 50, color: "#bdbdbd" }} />}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#667eea",
                    color: "white",
                    "&:hover": { backgroundColor: "#5568d3" },
                    boxShadow: "0 4px 12px rgba(102,126,234,0.4)",
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                  <input hidden accept="image/*" type="file" onChange={onFileChange} />
                </IconButton>
              </Box>
            </Box>

            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              label="Register Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <FormControl fullWidth required>
              <InputLabel>Batch</InputLabel>
              <Select
                value={badge}
                label="Batch"
                onChange={(e) => setBadge(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {badges.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #65408d 100%)",
                  },
                  "&:disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                {saving ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Profile"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setName("");
                  setRegNo("");
                  setBadge("");
                  setImageFile(null);
                  setImagePreview("");
                }}
                disabled={saving}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  minWidth: 100,
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#5568d3",
                    backgroundColor: "#f0f4ff",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
}
