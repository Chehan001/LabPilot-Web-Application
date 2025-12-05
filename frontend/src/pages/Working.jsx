import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function Working() {
  const [hours, setHours] = useState(null);
  const [today, setToday] = useState("");
  const [holidayMessage, setHolidayMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const ref = doc(db, "workingHours", "hours");
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("No working hours found in Firestore");
          return;
        }

        const data = snap.data();
        setHours(data);

        // Get --> today's name
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayName = dayNames[new Date().getDay()];
        setToday(todayName);

        // Holiday logic
        if (data[todayName] === "Closed") {
          setHolidayMessage("Closed");
        } else if (data.holiday) {
          setHolidayMessage(data.holiday);
        }
      } catch (e) {
        setError("Failed to fetch working hours");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  /*Loading UI */
  if (loading)
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          maxWidth: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress size={32} />
      </Paper>
    );

  if (error)
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #ef5350", maxWidth: 400 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );

  /** No hours found */
  if (!hours)
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid #ff9800", maxWidth: 400 }}>
        <Alert severity="warning">No working hours available.</Alert>
      </Paper>
    );

  const displayDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const todayHours = hours[today];
  const isOpen = todayHours !== "Closed" && !holidayMessage;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 10,
        border: "1px solid #e0e0e0",
        background: "white",
        maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            backgroundColor: "#f0f4ff",
            borderRadius: 10,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 28, color: "#667eea" }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Working Hours
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Our schedule this week
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", backgroundColor: "#e0e0e0", mb: 2 }} />

      {/* Hours List */}
      <Box sx={{ display: "grid", gap: 1.5 }}>
        {displayDays.map((day) => {
          const isToday = day === today;
          const dayHours = hours[day] || "Not set";
          const isClosed = dayHours === "Closed";

          return (
            <Box
              key={day}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 6,
                border: isToday ? "2px solid #667eea" : "1px solid #f0f0f0",
                backgroundColor: isToday ? "#f0f4ff" : "transparent",
              }}
            >
              <Typography sx={{ fontWeight: isToday ? 700 : 500 }}>{day}</Typography>
              <Typography sx={{ color: isClosed ? "#ef5350" : "#333" }}>{dayHours}</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: "#f9fafb", borderRadius: 2 }}>
        <Typography sx={{ fontSize: "0.85rem", color: "#666", textAlign: "center" }}>
          Need help?{" "}
          <span style={{ color: "#667eea", cursor: "pointer", fontWeight: 600 }}>
            Contact support
          </span>
        </Typography>
      </Box>
    </Paper>
  );
}
