const express = require("express");
const router = express.Router();
const auth = require("../middleware");
const userController = require("../controller/user");

//POST request to register
router.post("/register", userController.createUser);

//POST request to login
router.post("/login", userController.loginUser);

//GET reqest to /users fetch all user by admin and supervisor
router.get("/", auth.verifyToken, auth.isNotBasic, userController.getUsers);

//GET request /user/:id to fetch a single user by admin
router.get(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  userController.getUserById
);

//PUT request
router.put(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  userController.updateUserById
);

//DELETE request
router.delete(
  "/:id",
  auth.verifyToken,
  auth.isAdmin,
  userController.deleteUserById
);

module.exports = router;
