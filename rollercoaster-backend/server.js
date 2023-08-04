const express = require("express");
const app = express();
const pool = require("./db");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/rollercoaster-ranking-45bb7-firebase-adminsdk-lds5b-371cbdbc9f.json");
const port = 5000;
const cors = require("cors");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(" ")[1];
    // Verify the user's token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const authenticatedUserId = decodedToken.uid;

    // Attach the authenticated user ID to the request object for later use
    req.userId = authenticatedUserId;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ error: "Unauthorized access." });
  }
};

const corsSettings = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsSettings));
app.use(express.json());

// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (user_id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, email]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

// Add a new coaster for a specific user
app.post("/api/users/:userid/coasters", async (req, res) => {
  try {
    const userId = req.params.userid;
    const { name, park, rank, id } = req.body;
    const parkId = park["@id"];
    const parkName = park.name;
    const newCoaster = await pool.query(
      "INSERT INTO coasters (user_id, coaster_id, park_id, coaster_name, park_name, rank) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, id, parkId, name, parkName, rank]
    );

    const formattedCoaster = {
      "@id": `/api/coasters/${newCoaster.rows[0].coaster_id}`,
      "@type": "Coaster",
      id: newCoaster.rows[0].coaster_id,
      name: newCoaster.rows[0].coaster_name,
      park: {
        "@id": newCoaster.rows[0].park_id,
        "@type": "Park",
        name: newCoaster.rows[0].park_name,
      },
      rank: newCoaster.rows[0].rank,
    };
    console.log(formattedCoaster);
    res.status(201).json(formattedCoaster);
  } catch (error) {
    console.error("Error adding coaster:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the coaster." });
  }
});

// Retrieve selected coasters for a specific user
app.get("/api/users/:userid/coasters", async (req, res) => {
  try {
    const userId = req.params.userid;
    const coasters = await pool.query(
      "SELECT user_id, coaster_id, park_id, coaster_name, park_name, rank FROM coasters WHERE user_id = $1 ORDER BY rank",
      [userId]
    );

    const formattedCoasters = coasters.rows.map((coaster) => ({
      "@id": `/api/coasters/${coaster.coaster_id}`,
      "@type": "Coaster",
      id: coaster.coaster_id,
      name: coaster.coaster_name,
      park: {
        "@id": coaster.park_id,
        "@type": "Park",
        name: coaster.park_name,
      },
      rank: coaster.rank,
    }));
    console.log(formattedCoasters);
    res.status(200).json(formattedCoasters);
  } catch (error) {
    console.error("Error retrieving coasters:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving coasters." });
  }
});

// check to see if user already exists
app.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const userExists = result.rows.length > 0;
    res.status(200).json({ exists: userExists });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "An error occurred while getting user." });
  }
});

// Update coaster ranks for a specific user
app.put("/api/users/:userid/coasters", async (req, res) => {
  try {
    const userId = req.params.userid;
    const coasters = req.body;

    await pool.query("DELETE FROM coasters WHERE user_id = $1", [userId]);

    for (const coaster of coasters) {
      const { name, park, rank, id } = coaster;
      const parkId = park["@id"];
      const parkName = park.name;
      await pool.query(
        "INSERT INTO coasters (user_id, coaster_id, park_id, coaster_name, park_name, rank) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [userId, id, parkId, name, parkName, rank]
      );
    }

    res.status(200).json({ message: "Coasters updated successfully." });
  } catch (error) {
    console.error("Error updating coasters:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating coasters." });
  }
});

// Delete a coaster for a specific user
app.delete("/api/users/:userid/coasters/:coasterid", async (req, res) => {
  try {
    const userId = req.params.userid;
    
    const coasterId = req.params.coasterid;
    console.log(userId);
    console.log(coasterId);
    await pool.query(
      "DELETE FROM coasters WHERE user_id = $1 AND coaster_id = $2",
      [userId, coasterId]
    );

    res.status(200).json({ message: "Coaster deleted successfully." });
  } catch (error) {
    console.error("Error deleting coaster:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the coaster." });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
