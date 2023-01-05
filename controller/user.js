const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware");

//register
exports.createUser = async function (req, res) {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json("User Already Exist. Please Login");

  const validatePassword = (password) => {
    const re =
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/;
    return re.test(password);
  };
  if (!validatePassword(req.body.password)) {
    return res.status(400).send({
      error:
        "Password must contain at least 8 characters including uppercase, lowercase and special characters",
    });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = req.body;
  User.create(
    {
      email: user.email,
      password: hashedPassword,
      role: user.role,
    },
    (err, newUser) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res
          .status(201)
          .json({ message: "new user created", newUser });
      }
    }
  );
};

//login
exports.loginUser = async function (req, res) {

  //checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Email is not found");

  //password check
  const validPass = await bcrypt.compareSync(req.body.password, user.password);
  if (!validPass) return res.status(400).json("invalid password");

  try {
    const { token } = await generateToken(user);
    res.status(200).json({
      data: user,
      token,
    });
  } catch (err) {
    res.status(400).json({ message: "bad request" });
  }
};

//GET reqest to /users fetch all user
exports.getUsers = async (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else {
      return res.status(200).json({ users });
    }
  });
};

//GET request to fetch a single user
exports.getUserById = async (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!user) {
      return res.status(404).json({ message: "user was not found" });
    } else {
      return res.status(200).json({ user });
    }
  });
};

//PUT request
exports.updateUserById = async (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      stage: req.body.stage,
    },
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else if (!user) {
        return res.status(404).json({ message: "user not found" });
      } else {
        user.save((err, saveduser) => {
          if (err) {
            return res.status(400).json({ message: err });
          } else {
            return res
              .status(200)
              .json({ message: "user is updated successfully" });
          }
        });
      }
    }
  );
};

//DELETE request
exports.deleteUserById = async (req, res) => {
  User.findOneAndDelete(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else if (!user) {
      return res.status(404).json({ message: "user was not found" });
    } else {
      return res.status(200).json({ message: "user deleted successfully" });
    }
  });
};

