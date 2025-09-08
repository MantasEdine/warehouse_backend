import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  const { name, quantity = 0 } = req.body;

  try {
    const existing = await Product.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Product already exists" });
    }
    // console.log("test1")

    const product = await Product.create({ name, quantity });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Get one product by ID
// @route   GET /api/products/:id
export const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Update product (name, quantity)
// @route   PATCH /api/products/:id
export const updateProduct = async (req, res) => {
  const { name, quantity } = req.body;
  const updateData = {};
  try {
    if (name !== undefined) updateData.name = name;
    if (quantity !== undefined) updateData.quantity = quantity;

    const updatedProduct = await Product.findByIdAndUpdate(
     req.params.id,
     updateData,
     { new: true, runValidators: true }
  );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
