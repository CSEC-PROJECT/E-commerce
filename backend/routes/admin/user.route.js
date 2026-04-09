import express from "express";
import {getAllUsers,getUserById,deleteUser} from "../../controllers/admin/user.controller.js"

const router = express.Router();

router.get("/",getAllUsers)
router.get("/:id",getUserById)
router.delete("/:id",deleteUser)

// GET /api/users          → get all users
// GET /api/users/:id      → get single user
// DELETE /api/users/:id   → remove user
