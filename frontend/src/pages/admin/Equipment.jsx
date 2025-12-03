import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import BuildIcon from "@mui/icons-material/Build";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import GetAppIcon from "@mui/icons-material/GetApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BadgeIcon from "@mui/icons-material/Badge";
import NumbersIcon from "@mui/icons-material/Numbers";
import ScienceIcon from "@mui/icons-material/Science";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function Equipment() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // FORM STATES
  const [addData, setAddData] = useState({
    equipmentName: "",
    count: "",
    labName: "",
  });

  const [distributeData, setDistributeData] = useState({
    badgeNumber: "",
    equipmentName: "",
    count: "",
    labName: "",
  });

  const [receiveData, setReceiveData] = useState({
    badgeNumber: "",
    equipmentName: "",
    count: "",
    labName: "",
  });

  const [damageData, setDamageData] = useState({
    badgeNumber: "",
    studentRegNumber: "",
    equipmentName: "",
    count: "",
    labName: "",
  });

  // FIREBASE SUBMISSION
  const handleSubmit = async (collectionName, data, resetFunc) => {
    if (!auth.currentUser && !localStorage.getItem("admin")) {
      alert("You must be logged in as Admin to add equipment.");
      return;
    }

    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      resetFunc();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  };

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
  };

  const tabConfig = [
    {
      label: "Add Equipment",
      icon: <AddCircleOutlineIcon />,
        color: "#2196f3",
      gradient: "linear-gradient(135deg, #3ea0efff 0%, #42a5f5 100%)",
    },
    {
      label: "Distribute",
      icon: <SendIcon />,
      color: "#2196f3",
      gradient: "linear-gradient(135deg, #3ea0efff 0%, #42a5f5 100%)",
    },
    {
      label: "Receive",
      icon: <GetAppIcon />,
        color: "#2196f3",
      gradient: "linear-gradient(135deg, #3ea0efff 0%, #42a5f5 100%)",
    },
    {
      label: "Damage Report",
      icon: <WarningAmberIcon />,
       color: "#2196f3",
      gradient: "linear-gradient(135deg, #3ea0efff 0%, #42a5f5 100%)",
    },
  ];

  const renderCard = (title, icon, gradient, children) => (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" exit="exit">
      <Card
        elevation={0}
        sx={{
          maxWidth: 600,
          mx: "auto",
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          overflow: "visible",
          position: "relative",
        }}
      >
        {/* Header with Icon */}
        <Box
          sx={{
            background: gradient,
            p: 3,
            color: "white",
            borderRadius: "16px 16px 0 0",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              {icon}
            </Box>
            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>
          </Stack>
        </Box>

        <CardContent sx={{ p: 4 }}>{children}</CardContent>
      </Card>
    </motion.div>
  );

  const renderTextField = (label, value, onChange, icon, type = "text", placeholder = "") => (
    <TextField
      label={label}
      fullWidth
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
      }}
      sx={{
        mb: 2.5,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
          "&.Mui-focused": {
            boxShadow: "0 4px 20px rgba(33, 150, 243, 0.2)",
          },
        },
      }}
    />
  );

  const renderButton = (onClick, label, gradient) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        fullWidth
        variant="contained"
        onClick={onClick}
        startIcon={<CheckCircleOutlineIcon />}
        sx={{
          py: 1.8,
          borderRadius: 14,
          textTransform: "none",
          fontSize: "1.05rem",
          fontWeight: 600,
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
          "&:hover": {
            background: "linear-gradient(90deg, #1565c0, #1976d2)",
            boxShadow: "0 6px 30px rgba(25, 118, 210, 0.5)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {label}
      </Button>
    </motion.div>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                color: "rgba(94, 92, 92, 0.9)",
                fontWeight: 700,
                mb: 1,
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              Equipment Management
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(94, 92, 92, 0.9)" }}>
              Efficiently manage lab equipment distribution and tracking
            </Typography>
          </Box>

          {/* Success Alert */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    maxWidth: 600,
                    mx: "auto",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                  }}
                  icon={<CheckCircleOutlineIcon />}
                >
                  <Typography fontWeight={600}>Successfully saved!</Typography>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs Card */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                  py: 2.5,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "rgba(255,255,255,0.95)",
                    background: "rgba(255,255,255,0.1)",
                  },
                },
                "& .Mui-selected": {
                  color: "#fff !important",
                  background: "rgba(255,255,255,0.2)",
                },
                "& .MuiTabs-indicator": {
                  height: 4,
                  backgroundColor: "#fff",
                  borderRadius: "4px 4px 0 0",
                },
              }}
            >
              {tabConfig.map((tab, idx) => (
                <Tab
                  key={idx}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                />
              ))}
            </Tabs>

            <Box sx={{ p: { xs: 2, md: 5 }, minHeight: 500, background: "#fafafa" }}>
              <AnimatePresence mode="wait">
                {/* ADD EQUIPMENT */}
                {tabIndex === 0 &&
                  renderCard(
                    "Add New Equipment",
                    <AddCircleOutlineIcon sx={{ fontSize: 28 }} />,
                    tabConfig[0].gradient,
                    <>
                      {renderTextField(
                        "Equipment Name",
                        addData.equipmentName,
                        (e) => setAddData({ ...addData, equipmentName: e.target.value }),
                        <BuildIcon color="action" />,
                        "text",
                        "e.g., Microscope, Beaker, etc."
                      )}

                      {renderTextField(
                        "Quantity",
                        addData.count,
                        (e) => setAddData({ ...addData, count: e.target.value }),
                        <NumbersIcon color="action" />,
                        "number",
                        "Enter quantity"
                      )}

                      {renderTextField(
                        "Laboratory Name",
                        addData.labName,
                        (e) => setAddData({ ...addData, labName: e.target.value }),
                        <ScienceIcon color="action" />,
                        "text",
                        "e.g., Chemistry Lab, Physics Lab"
                      )}

                      {renderButton(
                        () =>
                          handleSubmit("addEquipment", addData, () =>
                            setAddData({ equipmentName: "", count: "", labName: "" })
                          ),
                        "Add Equipment",
                        tabConfig[0].gradient
                      )}
                    </>
                  )}

                {/* DISTRIBUTE EQUIPMENT */}
                {tabIndex === 1 &&
                  renderCard(
                    "Distribute Equipment",
                    <SendIcon sx={{ fontSize: 28 }} />,
                    tabConfig[1].gradient,
                    <>
                      {renderTextField(
                        "Badge Number",
                        distributeData.badgeNumber,
                        (e) => setDistributeData({ ...distributeData, badgeNumber: e.target.value }),
                        <BadgeIcon color="action" />,
                        "text",
                        "Enter badge number"
                      )}

                      {renderTextField(
                        "Equipment Name",
                        distributeData.equipmentName,
                        (e) => setDistributeData({ ...distributeData, equipmentName: e.target.value }),
                        <BuildIcon color="action" />,
                        "text",
                        "Select equipment"
                      )}

                      {renderTextField(
                        "Quantity",
                        distributeData.count,
                        (e) => setDistributeData({ ...distributeData, count: e.target.value }),
                        <NumbersIcon color="action" />,
                        "number",
                        "Quantity to distribute"
                      )}

                      {renderTextField(
                        "Laboratory Name",
                        distributeData.labName,
                        (e) => setDistributeData({ ...distributeData, labName: e.target.value }),
                        <ScienceIcon color="action" />,
                        "text",
                        "Destination lab"
                      )}

                      {renderButton(
                        () =>
                          handleSubmit("distributeEquipment", distributeData, () =>
                            setDistributeData({ badgeNumber: "", equipmentName: "", count: "", labName: "" })
                          ),
                        "Distribute Equipment",
                        tabConfig[1].gradient
                      )}
                    </>
                  )}

                {/* RECEIVE EQUIPMENT */}
                {tabIndex === 2 &&
                  renderCard(
                    "Receive Equipment",
                    <GetAppIcon sx={{ fontSize: 28 }} />,
                    tabConfig[2].gradient,
                    <>
                      {renderTextField(
                        "Badge Number",
                        receiveData.badgeNumber,
                        (e) => setReceiveData({ ...receiveData, badgeNumber: e.target.value }),
                        <BadgeIcon color="action" />,
                        "text",
                        "Enter badge number"
                      )}

                      {renderTextField(
                        "Equipment Name",
                        receiveData.equipmentName,
                        (e) => setReceiveData({ ...receiveData, equipmentName: e.target.value }),
                        <BuildIcon color="action" />,
                        "text",
                        "Equipment being returned"
                      )}

                      {renderTextField(
                        "Quantity",
                        receiveData.count,
                        (e) => setReceiveData({ ...receiveData, count: e.target.value }),
                        <NumbersIcon color="action" />,
                        "number",
                        "Quantity received"
                      )}

                      {renderTextField(
                        "Laboratory Name",
                        receiveData.labName,
                        (e) => setReceiveData({ ...receiveData, labName: e.target.value }),
                        <ScienceIcon color="action" />,
                        "text",
                        "Source lab"
                      )}

                      {renderButton(
                        () =>
                          handleSubmit("receiveEquipment", receiveData, () =>
                            setReceiveData({ badgeNumber: "", equipmentName: "", count: "", labName: "" })
                          ),
                        "Confirm Receipt",
                        tabConfig[2].gradient
                      )}
                    </>
                  )}

                {/* DAMAGE EQUIPMENT */}
                {tabIndex === 3 &&
                  renderCard(
                    "Report Damaged Equipment",
                    <WarningAmberIcon sx={{ fontSize: 28 }} />,
                    tabConfig[3].gradient,
                    <>
                      {renderTextField(
                        "Badge Number",
                        damageData.badgeNumber,
                        (e) => setDamageData({ ...damageData, badgeNumber: e.target.value }),
                        <BadgeIcon color="action" />,
                        "text",
                        "Staff badge number"
                      )}

                      {renderTextField(
                        "Student Register Number",
                        damageData.studentRegNumber,
                        (e) => setDamageData({ ...damageData, studentRegNumber: e.target.value }),
                        <PersonIcon color="action" />,
                        "text",
                        "Student registration number"
                      )}

                      {renderTextField(
                        "Equipment Name",
                        damageData.equipmentName,
                        (e) => setDamageData({ ...damageData, equipmentName: e.target.value }),
                        <BuildIcon color="action" />,
                        "text",
                        "Damaged equipment"
                      )}

                      {renderTextField(
                        "Quantity Damaged",
                        damageData.count,
                        (e) => setDamageData({ ...damageData, count: e.target.value }),
                        <NumbersIcon color="action" />,
                        "number",
                        "Number of damaged items"
                      )}

                      {renderTextField(
                        "Laboratory Name",
                        damageData.labName,
                        (e) => setDamageData({ ...damageData, labName: e.target.value }),
                        <ScienceIcon color="action" />,
                        "text",
                        "Lab where damage occurred"
                      )}

                      {renderButton(
                        () =>
                          handleSubmit("damageEquipment", damageData, () =>
                            setDamageData({
                              badgeNumber: "",
                              studentRegNumber: "",
                              equipmentName: "",
                              count: "",
                              labName: "",
                            })
                          ),
                        "Submit Damage Report",
                        tabConfig[3].gradient
                      )}
                    </>
                  )}
              </AnimatePresence>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Box>
  );
}