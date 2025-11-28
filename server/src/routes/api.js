import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET all characters
router.get("/characters", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM characters ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ 
      error: "Failed to fetch characters",
      details: error.message,
      hint: "Make sure the database is set up. Run: npm run setup-db"
    });
  }
});

// CREATE a new character
router.post("/characters", async (req, res) => {
  try {
    const { name, house, image_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      "INSERT INTO characters (name, house, votes, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, house || null, 0, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating character:", error);
    res.status(500).json({ error: "Failed to create character" });
  }
});

// UPDATE a character's vote count
router.put("/characters/:id/vote", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE characters SET votes = votes + 1 WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Character not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating vote:", error);
    res.status(500).json({ error: "Failed to update vote" });
  }
});

// DELETE a character
router.delete("/characters/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM characters WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Character not found" });
    }
    res.json({ message: "Character deleted successfully", character: result.rows[0] });
  } catch (error) {
    console.error("Error deleting character:", error);
    res.status(500).json({ error: "Failed to delete character" });
  }
});

export default router;
