import express from "express";
import {
  LoggedInUser,
  login,
  logout,
  makeHashPass,
  register,
} from "../controllers/authController.js";
import tokenVerify from "../middlewares/verifyToken.js";

// init router
const router = express.Router();

// create router
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/hash").post(makeHashPass);
router.route("/register").post(register);
router.route("/me").get(tokenVerify, LoggedInUser);

// export
export default router;
