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
} from "@mui/material";

import { motion, AnimatePresence } from "framer-motion";
import { db, auth } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Chemical() {
  const [tabIndex, setTabIndex] = useState(0);

  // Form
  const [addData, setAddData] = useState({
    chemicalName: "",
    quantity: "",
    labName: "",
  });

  const [distributeData, setDistributeData] = useState({
    badgeNumber: "",
    chemicalName: "",
    quantity: "",
    labName: "",
  });

  const [receiveData, setReceiveData] = useState({
    badgeNumber: "",
    chemicalName: "",
    quantity: "",
    labName: "",
  });

  // FireBase Submission
  const handleSubmit = async (collectionName, data, resetFunc) => {
    if (!auth.currentUser && !localStorage.getItem("admin")) {
      alert("You must be logged in as Admin to continue.");
      return;
    }

    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });

      alert("Saved successfully!");
      resetFunc();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  };

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  // Animation 
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
  };

  const renderCard = (children) => (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" exit="exit">
      <Card
        sx={{
          maxWidth: 500,
          mx: "auto",
          p: 2,
          borderRadius: "18px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );

  const renderButton = (onClick) => (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        fullWidth
        variant="contained"
        onClick={onClick}
        sx={{ py: 1.3, borderRadius: "20px" }}
      >
        Submit
      </Button>
    </motion.div>
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Add Chemical" />
        <Tab label="Distribute Chemical" />
        <Tab label="Receive Chemical" />
      </Tabs>

      <AnimatePresence mode="wait">
        {/* ADD CHEMICAL */}
        {tabIndex === 0 &&
          renderCard(
            <>
              <Typography variant="h6" mb={2} fontWeight="bold"></Typography>

              <TextField
                label="Chemical Name"
                fullWidth
                value={addData.chemicalName}
                onChange={(e) =>
                  setAddData({ ...addData, chemicalName: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Quantity (ml / g) "
                type="number"
                fullWidth
                value={addData.quantity}
                onChange={(e) =>
                  setAddData({ ...addData, quantity: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Lab Name"
                fullWidth
                value={addData.labName}
                onChange={(e) =>
                  setAddData({ ...addData, labName: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              {renderButton(() =>
                handleSubmit("addChemical", addData, () =>
                  setAddData({ chemicalName: "", quantity: "", labName: "" })
                )
              )}
            </>
          )}

        {/* DISTRIBUTE CHEMICAL */}
        {tabIndex === 1 &&
          renderCard(
            <>
              <Typography variant="h6" mb={2} fontWeight="bold"></Typography>

              <TextField
                label="Badge Number"
                fullWidth
                value={distributeData.badgeNumber}
                onChange={(e) =>
                  setDistributeData({
                    ...distributeData,
                    badgeNumber: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Chemical Name"
                fullWidth
                value={distributeData.chemicalName}
                onChange={(e) =>
                  setDistributeData({
                    ...distributeData,
                    chemicalName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Quantity (ml / g)"
                type="number"
                fullWidth
                value={distributeData.quantity}
                onChange={(e) =>
                  setDistributeData({ ...distributeData, quantity: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Lab Name"
                fullWidth
                value={distributeData.labName}
                onChange={(e) =>
                  setDistributeData({
                    ...distributeData,
                    labName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              {renderButton(() =>
                handleSubmit("distributeChemical", distributeData, () =>
                  setDistributeData({
                    badgeNumber: "",
                    chemicalName: "",
                    quantity: "",
                    labName: "",
                  })
                )
              )}
            </>
          )}

        {/* RECEIVE CHEMICAL */}
        {tabIndex === 2 &&
          renderCard(
            <>
              <Typography variant="h6" mb={2} fontWeight="bold"></Typography>

              <TextField
                label="Badge Number"
                fullWidth
                value={receiveData.badgeNumber}
                onChange={(e) =>
                  setReceiveData({
                    ...receiveData,
                    badgeNumber: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Chemical Name"
                fullWidth
                value={receiveData.chemicalName}
                onChange={(e) =>
                  setReceiveData({
                    ...receiveData,
                    chemicalName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Quantity (ml / g)"
                type="number"
                fullWidth
                value={receiveData.quantity}
                onChange={(e) =>
                  setReceiveData({ ...receiveData, quantity: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                label="Lab Name"
                fullWidth
                value={receiveData.labName}
                onChange={(e) =>
                  setReceiveData({
                    ...receiveData,
                    labName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />

              {renderButton(() =>
                handleSubmit("receiveChemical", receiveData, () =>
                  setReceiveData({
                    badgeNumber: "",
                    chemicalName: "",
                    quantity: "",
                    labName: "",
                  })
                )
              )}
            </>
          )}
      </AnimatePresence>
    </Box>
  );
}
