const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserByFirebaseId,
  createUser,
  getUserStats,
} = require("../controllers/users.controllers");

router.get("/users", getUsers);
router.get("/users/:firebase_uid", getUserByFirebaseId);
router.post("/users", createUser);

router.get("/users/stats/:firebase_uid", getUserStats);

module.exports = router;
