import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @DESC user login
 * @ROUTE /api/v1/auth
 * @method POST
 * @access public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validate data
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // find login user by email
  const loginUser = await User.findOne({ email }).populate("role");

  if (!loginUser) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  // check user pass
  const passCheck = await bcrypt.compare(password, loginUser.password);

  if (!passCheck) {
    return res.status(400).json({ message: "Wrong password" });
  }

  // create access token
  const token = jwt.sign(
    { email: loginUser.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    }
  );

  // create refresh token
  const refreshToken = jwt.sign(
    { email: loginUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    }
  );

  // cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token,
    user: loginUser,
  });
});

/**
 * @DESC user logout
 * @ROUTE /api/v1/auth
 * @method POST
 * @access public
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successfully" });
});

/**
 * @DESC user register
 * @ROUTE /api/v1/auth
 * @method POST
 * @access public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // validate data
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check email
  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // hash password
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({ name, email, password: hashPass });

  res.status(201).json({
    user,
    message: "User created successfully",
  });
});

/**
 * @DESC logged in user
 * @ROUTE /api/v1/auth
 * @method get
 * @access public
 */
export const LoggedInUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.me);
});

/**
 * @DESC make hash pass
 * @ROUTE /api/v1/auth
 * @method get
 * @access public
 */
export const makeHashPass = asyncHandler(async (req, res) => {
  const { password } = req.body;
  // hash password
  const hashPass = await bcrypt.hash(password, 10);
  res.status(200).json({ hashPass });
});
