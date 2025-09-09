import Store from "../models/Store.js";

// @desc    Get all stores
// @route   GET /api/stores
export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate({
      path: "productsDelivered.product productsDelivered.deliveryGuy",
      select: "name",
    });

    if (!stores.length) {
      return res.status(404).json({ message: "No stores found" });
    }

    res.status(200).json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get one store by ID
// @route   GET /api/stores/:id
export const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate({
      path: "productsDelivered.product productsDelivered.deliveryGuy",
      select: "name",
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(store);
  } catch (err) {
    console.error("Error fetching store:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create new store
// @route   POST /api/stores
export const createStore = async (req, res) => {
  const { name, location, wilaya, baladya } = req.body;

  if (!name || !location || !wilaya || !baladya) {
    return res.status(400).json({ message: "Name, location, wilaya, and baladya are required" });
  }

  try {
    const existing = await Store.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Store already exists" });
    }

    const store = await Store.create({ name, location, wilaya, baladya });
    res.status(201).json(store);
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update store
// @route   PATCH /api/stores/:id
export const updateStore = async (req, res) => {
  const { name, location, wilaya, baladya } = req.body;
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (location !== undefined) updateData.location = location;
  if (wilaya !== undefined) updateData.wilaya = wilaya;
  if (baladya !== undefined) updateData.baladya = baladya;

  try {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(updatedStore);
  } catch (err) {
    console.error("Error updating store:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
export const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Store deleted successfully", store });
  } catch (err) {
    console.error("Error deleting store:", err);
    res.status(500).json({ error: err.message });
  }
};
