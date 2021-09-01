const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:searchText", authMiddleware, async (req, res) => {
  const { searchText } = req.params;
  if (searchText.length === 0) return;

  try {
    const results = await UserModel.find({
      name: { $regex: searchText, $options: "i" },
    });
    console.log({ searchText, results });
    res.json(results);
  } catch (err) {
    console.error("Error", err);
    return res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
