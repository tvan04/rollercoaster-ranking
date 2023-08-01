const express = require("express");
const router = express();
const pool = require("./db");
const port = 5000;

router.use(express.json());

// Save selected coasters for a specific user
router.post("/:userid", async (req, res) => {
  const userId = req.params.userid;
  const selectedCoasters = req.body;

  try {
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
router.get("/:userid", async (req, res) => {
  const userId = req.params.userid;

  try {
    const result = await pool.query(
      "SELECT id, name, park, rank FROM coasters WHERE userid = $1 ORDER BY rank",
      [userId]
    );

    const selectedCoasters = result.rows;
    res.status(200).json(selectedCoasters);
  } catch (error) {
    console.error("Error retrieving coasters:", error);
    res.status(500).json({ error: "An error occurred while retrieving coasters." });
  }
});

router.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});