import { getAllProduct } from "../services/productService";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getAllProduct();
    res.status(200).send(products);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});

export default router;