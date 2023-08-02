const express = require("express");
const app = express();
const pool = require("./db");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/rollercoaster-ranking-45bb7-firebase-adminsdk-lds5b-371cbdbc9f.json");
const port = 5000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());

// Save selected coasters for a specific user
app.post("/:userid", async (req, res) => {
  const userId = req.params.userid;
  const selectedCoasters = req.body;

  try {
    // Verify the user's token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const authenticatedUserId = decodedToken.uid;

    // Ensure that the authenticated user matches the requested user ID
    if (authenticatedUserId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    await pool.query("DELETE FROM coasters WHERE userid = $1", [userId]);

    for (const coaster of selectedCoasters) {
      const { id, name, park, rank } = coaster;
      await pool.query(
        "INSERT INTO coasters (userid, id, name, park, rank) VALUES ($1, $2, $3, $4, $5)",
        [userId, id, name, park, rank]
      );
    }

    res.status(200).json({ message: "Coasters saved successfully." });
  } catch (error) {
    console.error("Error saving coasters:", error);
    res.status(500).json({ error: "An error occurred while saving coasters." });
  }
});

// Retrieve selected coasters for a specific user
app.get("/:userid", async (req, res) => {
  const userId = req.params.userid;

  try {
    // Verify the user's token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const authenticatedUserId = decodedToken.uid;

    // Ensure that the authenticated user matches the requested user ID
    if (authenticatedUserId !== userId) {
      return res.status(403).json({ error: "Unauthorized access." });
    }
    const result = await pool.query(
      "SELECT id, name, park, rank FROM coasters WHERE userid = $1 ORDER BY rank",
      [userId]
    );

    const selectedCoasters = result.rows;
    res.status(200).json(selectedCoasters);
  } catch (error) {
    console.error("Error retrieving coasters:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving coasters." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

