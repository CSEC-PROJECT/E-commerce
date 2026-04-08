import express from "express"
import {getCart,createCart,updateCartById,deleteCartById} from "../../controllers/user/cart.controller.js"

const router = express.Router();

router.get("/",getCart)
router.post("/",createCart)
router.put("/:id",updateCartById)
router.delete("/:id",deleteCartById)

// GET /api/cart
// POST /api/cart        → add item
// PUT /api/cart/:id     → update quantity
// DELETE /api/cart/:id  → remove item