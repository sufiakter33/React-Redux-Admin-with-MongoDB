import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import Role from "../models/role.js";
import { createSlug } from "../helper/slug.js";

/**
 * @DESC Get all roles data
 * @ROUTE /api/v1/role
 * @method GET
 * @access public
 */
export const getAllRole = asyncHandler(async (req, res) => {
  const roles = await Role.find();

  if (roles.length > 0) {
    res.status(200).json(roles);
  }
});

/**
 * @DESC Get Single roles data
 * @ROUTE /api/v1/role/:id
 * @method GET
 * @access public
 */
export const getSingleRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);

  if (!role) {
    return res.status(404).json({ message: "Role data not found" });
  }

  res.status(200).json(role);
});

/**
 * @DESC Create new role
 * @ROUTE /api/v1/role
 * @method POST
 * @access public
 */
export const createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  // check role
  const roleCheck = await Role.findOne({ name });

  if (roleCheck) {
    return res.status(400).json({ message: "Role already exists" });
  }

  // create new role
  const role = await Role.create({
    name,
    slug: createSlug(name),
    permissions,
  });

  res.status(201).json({
    role,
    message: "Role created successfully",
  });
});

/**
 * @DESC Delete role
 * @ROUTE /api/v1/role/:id
 * @method DELETE
 * @access public
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findByIdAndDelete(id);

  res.status(200).json({ role, message: "Role deleted successfully" });
});

/**
 * @DESC Update role
 * @ROUTE /api/v1/role/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  const role = await Role.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
      permissions: permissions,
    },
    { new: true }
  );

  res.status(200).json({ role, message: "Role updated successfully" });
});

/**
 * @DESC Update role status
 * @ROUTE /api/v1/role/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const role = await Role.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ role, message: "Role status updated" });
});
