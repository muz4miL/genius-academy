const Inventory = require('../models/inventorySchema');

// Get all inventory items for a school
const getInventoryList = async (req, res) => {
    try {
        const items = await Inventory.find({ school: req.params.id }).sort({ category: 1, itemName: 1 });
        res.send(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Add new inventory item
const addInventoryItem = async (req, res) => {
    try {
        const { itemName, category, quantity, unitPrice, schoolId } = req.body;

        const item = new Inventory({
            itemName,
            category,
            quantity,
            unitPrice,
            school: schoolId
        });

        const result = await item.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
    try {
        const { itemName, category, quantity, unitPrice } = req.body;

        const result = await Inventory.findByIdAndUpdate(
            req.params.id,
            { itemName, category, quantity, unitPrice },
            { new: true }
        );

        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
    try {
        const result = await Inventory.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get inventory stats (for dashboard)
const getInventoryStats = async (req, res) => {
    try {
        const items = await Inventory.find({ school: req.params.id });

        const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const lowStockCount = items.filter(item => item.quantity < 5).length;
        const totalItems = items.length;

        res.send({ totalValue, lowStockCount, totalItems });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { getInventoryList, addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryStats };
