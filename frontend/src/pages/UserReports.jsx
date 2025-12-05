import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { auth, db, storage } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UserReports() {
  const [tab, setTab] = useState(0);
  const [regNo, setRegNo] = useState("");
  const [labName, setLabName] = useState("");
  const [batch, setBatch] = useState("");
  const [practicalDate, setPracticalDate] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [myReports, setMyReports] = useState([]);

  // Auto-fill REGNO from email
  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      setRegNo(user.email.split("@")[0]);
    }
  }, []);

  // Fetch student reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!regNo) return;
      const snap = await getDocs(collection(db, "reports", regNo, "userReports"));
      const list = snap.docs.map((doc) => doc.data());
      setMyReports(list.reverse()); // Show latest first
    };
    fetchReports();
  }, [regNo]);

  // Submit Report
  const handleSubmit = async () => {
    if (!labName || !batch || !practicalDate || !reportFile) {
      alert("Please fill all fields");
      return;
    }

    const submittedDate = new Date().toISOString().split("T")[0];

    try {
      // Upload PDF
      const fileRef = ref(
        storage,
        `reports/${regNo}/${Date.now()}_${reportFile.name}`
      );
      await uploadBytes(fileRef, reportFile);
      const pdfUrl = await getDownloadURL(fileRef);

      // Save to Firestore
      await addDoc(collection(db, "reports", regNo, "userReports"), {
        labName,
        batch,
        regNo,
        practicalDate,
        submittedDate,
        pdfUrl,
      });

      alert("Report submitted!");
      setLabName("");
      setBatch("");
      setPracticalDate("");
      setReportFile(null);

      // Refresh reports
      const snap = await getDocs(collection(db, "reports", regNo, "userReports"));
      setMyReports(snap.docs.map((doc) => doc.data()).reverse());
    } catch (err) {
      console.error(err);
      alert("Submission failed!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        marginLeft: { xs: 0, lg: "60px" }, // Space --> navbar
        transition: "margin-left 0.35s ease",
        background: "linear-gradient(135deg, #b6cdefff 0%, #044abcff 100%)",
      }}
    >
      <Box p={3} sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            background: "linear-gradient(135deg, #080c84ff 0%, #051a52ff 40%, #061442ff 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            textShadow: "0 0 10px rgba(90,110,255,0.4), 0 0 20px rgba(90,110,255,0.3)",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            animation: "fadeSlide 1.1s ease",
            "@keyframes fadeSlide": {
              "0%": { opacity: 0, transform: "translateY(-10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          Laboratory Reports
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          centered
          sx={{
            mb: 3,
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              fontSize: "1rem",
              color: "#4a4a4a",
            },
            "& .Mui-selected": {
              background:"linear-gradient(135deg, #1b1fab 0%, #1843b9 40%, #1e3ca1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
            },
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1b1fab 0%, #1843b9 40%, #1e3ca1 100%)",
            },
          }}
        >
          <Tab label="Submit Report" />
          <Tab label="My Reports" />
        </Tabs>

        {/* Submit Report */}
        {tab === 0 && (
          <Card
            sx={{
              p: 4,
              borderRadius: 8,
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: "0 12px 24px rgba(0,0,0,0.18)" },
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={3}>
              Submit New Report
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Lab Name"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                fullWidth
              />
              <TextField label="Register Number" value={regNo} disabled fullWidth />
              <TextField
                label="Practical Date"
                type="date"
                value={practicalDate}
                onChange={(e) => setPracticalDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Submitted Date"
                value={new Date().toISOString().split("T")[0]}
                disabled
                fullWidth
              />

              <Button
                variant="outlined"
                component="label"
                sx={{
                  mt: 1,
                  borderRadius: 10,
                  borderColor: "#4b5cff",
                  color: "#4b5cff",
                  "&:hover": { background: "#f0f4ff" },
                }}
              >
                {reportFile ? `Selected: ${reportFile.name}` : "Upload PDF Report"}
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => setReportFile(e.target.files[0])}
                />
              </Button>

              <Button
                variant="contained"
                sx={{
                  borderRadius: 10,
                  mt: 1,
                  background: "linear-gradient(135deg, #77b5f8ff, #030b82ff)",
                  "&:hover": { background: "linear-gradient(135deg, #030b82ff,#77b5f8ff)" },
                }}
                onClick={handleSubmit}
              >
                Submit Report
              </Button>
            </Box>
          </Card>
        )}

        {/*  My Reports  */}
        {tab === 1 && (
          <Box display="flex" flexDirection="column" gap={2}>
            {myReports.length === 0 ? (
              <Typography textAlign="center" color="text.secondary">
                No reports submitted yet.
              </Typography>
            ) : (
              myReports.map((r, i) => (
                <Card
                  key={i}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
                    transition: "all 0.3s ease",
                    background: "#f9faff",
                  }}
                >
                  <Typography fontWeight={600} mb={1}>
                    {r.labName} - Batch {r.batch}
                  </Typography>
                  <Typography fontSize={14} color="text.secondary">
                    Practical Date: {r.practicalDate}
                  </Typography>
                  <Typography fontSize={14} color="text.secondary">
                    Submitted: {r.submittedDate}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />
                  <Button
                    href={r.pdfUrl}
                    target="_blank"
                    variant="outlined"
                    sx={{
                      color: "#4b5cff",
                      borderColor: "#4b5cff",
                      "&:hover": { background: "#f0f4ff" },
                    }}
                  >
                    View Report
                  </Button>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
