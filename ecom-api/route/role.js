import express from "express";
import tokenVerify from "../middlewares/verifyToken.js";
import {
  createRole,
  deleteRole,
  getAllRole,
  getSingleRole,
  updateRole,
  updateRoleStatus,
} from "../controllers/roleController.js";

// init router
const router = express.Router();

// use verify token
router.use(tokenVerify);

// create route
router.route("/").get(getAllRole).post(createRole);
router
  .route("/:id")
  .get(getSingleRole)
  .delete(deleteRole)
  .patch(updateRole)
  .put(updateRoleStatus);

// export default router
export default router;
