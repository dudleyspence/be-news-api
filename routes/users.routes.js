const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserByFirebaseId,
  createUser,
} = require("../controllers/users.controllers");

router.get("/users", getUsers);
router.get("/users/:firebase_uid", getUserByFirebaseId);
router.post("/users", createUser);

module.exports = router;
