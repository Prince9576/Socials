const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  const { searchText } = req.query;
  if (searchText.length === 0) return;

  try {
    let userPattern = new RegExp(`^${searchText}`);
    const results = await UserModel.find({
      name: { $regex: userPattern, $options: "i" },
    });

    res.json(results);
  } catch (err) {
    console.error("Error", err);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
