import express from "express";
import { getAllProduct } from "../services/productService";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getAllProduct();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});
export default router;
