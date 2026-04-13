import express from "express";
import { getCart, createCart, updateCartById, deleteCartById } from "../../controllers/user/cart.controller.js";
import { authenticate } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/", authenticate, getCart);
router.post("/", authenticate, createCart);
router.put("/:id", authenticate, updateCartById);
router.delete("/:id", authenticate, deleteCartById);


export default router;


