import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function Working() {
  const [hours, setHours] = useState({});
  const [today, setToday] = useState("");
  const [holiday, setHoliday] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const docRef = doc(db, "workingHours", "hours");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHours(data);

          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const todayIndex = new Date().getDay();
          const todayName = dayNames[todayIndex];
          setToday(todayName);

          const todayHoliday = data[todayName] === "Closed" ? "Closed" : data.holiday || "";
          setHoliday(todayHoliday);
        } else {
          setError("No working hours found in Firestore");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch working hours");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHours();
  }, []);

  if (isLoading)
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
        <CircularProgress size={32} sx={{ color: "#667eea" }} />
      </Paper>
    );

  if (error)
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #ef5350",
          maxWidth: 400,
        }}
      >
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Paper>
    );

  if (!hours || Object.keys(hours).length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #ff9800",
          maxWidth: 500,
        }}
      >
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Unable to load hours. Check Firestore.
        </Alert>
      </Paper>
    );
  }

  const displayDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const isOpen = hours[today] !== "Closed" && !holiday;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
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
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 28, color: "#667eea" }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
            Working Hours
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", fontSize: "0.875rem" }}>
            Our schedule this week
          </Typography>
        </Box>
      </Box>

      {/* Today's Status Alert */}
      <Alert
        severity={isOpen ? "success" : "info"}
        icon={isOpen ? <CheckCircleIcon /> : <AccessTimeIcon />}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${isOpen ? "#4caf50" : "#2196f3"}`,
          backgroundColor: isOpen ? "#f1f8f4" : "#e3f2fd",
          "& .MuiAlert-icon": {
            color: isOpen ? "#2e7d32" : "#1565c0",
          },
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: isOpen ? "#2e7d32" : "#1565c0" }}>
          Today: {today}
        </Typography>
        <Typography sx={{ fontSize: "0.9rem", color: isOpen ? "#1b5e20" : "#0d47a1" }}>
          {holiday || (isOpen ? "We're open now!" : "Closed today")}
        </Typography>
      </Alert>

      {/* Divider */}
      <Box sx={{ height: "1px", backgroundColor: "#e0e0e0", mb: 2 }} />

      {/* Hours List */}
      <Box sx={{ display: "grid", gap: 1.5 }}>
        {displayDays.map((day) => {
          const isToday = today === day;
          const dayHours = hours[day] || "Not set";
          const isClosed = dayHours === "Closed";

          return (
            <Box
              key={day}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                backgroundColor: isToday ? "#f0f4ff" : "transparent",
                border: isToday ? "2px solid #667eea" : "1px solid #f0f0f0",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isToday ? "#f0f4ff" : "#fafafa",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Status Dot */}
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: isToday ? "#667eea" : isClosed ? "#ef5350" : "#4caf50",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? "#667eea" : "#333",
                    fontSize: "0.95rem",
                  }}
                >
                  {day}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontWeight: isToday ? 600 : 400,
                  color: isClosed ? "#ef5350" : isToday ? "#667eea" : "#666",
                  fontSize: "0.9rem",
                }}
              >
                {dayHours}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: "#f9fafb",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            fontSize: "0.85rem",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Need to reach us outside these hours?
          <br />
          <Typography
            component="span"
            sx={{
              color: "#667eea",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Contact support
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
}