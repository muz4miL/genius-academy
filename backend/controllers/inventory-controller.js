const Inventory = require('../models/inventorySchema');

// Configuration
const MIN_STOCK_THRESHOLD = 5;

// Consume Item (Atomic Operation)
const consumeItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        
        // Validation
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }
        
        // Atomic decrement with validation
        const item = await Inventory.findOneAndUpdate(
            { 
                _id: itemId, 
                quantity: { $gte: quantity } // Only update if stock available
            },
            { 
                $inc: { quantity: -quantity } 
            },
            { new: true }
        );
        
        if (!item) {
            return res.status(400).json({
                message: "Insufficient stock or item not found"
            });
        }
        
        // Low stock alert
        const lowStockAlert = item.quantity < MIN_STOCK_THRESHOLD;
        
        res.status(200).json({
            success: true,
            message: "Item consumed successfully",
            item: {
                itemName: item.itemName,
                remainingStock: item.quantity,
                lowStockAlert: lowStockAlert
            },
            alert: lowStockAlert ? {
                message: `WARNING: Low stock! Only ${item.quantity} units remaining.`,
                threshold: MIN_STOCK_THRESHOLD
            } : null
        });
    } catch (err) {
        res.status(500).json({ message: "Error consuming item", error: err.message });
    }
};

// Add new inventory item
const addItem = async (req, res) => {
    try {
        const { itemName, category, quantity, unitPrice } = req.body;
        const schoolId = req.user.schoolId;

        const item = new Inventory({
            itemName,
            category,
            quantity,
            unitPrice,
            school: schoolId
        });

        const result = await item.save();
        
        res.status(201).json({
            success: true,
            message: "Inventory item added successfully",
            item: result
        });
    } catch (err) {
        res.status(500).json({ message: "Error adding item", error: err.message });
    }
};

// Restock Item
const restockItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }
        
        const item = await Inventory.findByIdAndUpdate(
            itemId,
            { $inc: { quantity: quantity } },
            { new: true }
        );
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.status(200).json({
            success: true,
            message: "Item restocked successfully",
            item: item
        });
    } catch (err) {
        res.status(500).json({ message: "Error restocking item", error: err.message });
    }
};

// Get all inventory items for a school
const getInventoryList = async (req, res) => {
    try {
        const schoolId = req.user?.schoolId || req.params.id;
        
        const items = await Inventory.find({ school: schoolId })
            .sort({ category: 1, itemName: 1 });
        
        res.status(200).json({
            success: true,
            count: items.length,
            items: items
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching inventory", error: err.message });
    }
};

// Get Low Stock Items
const getLowStock = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        const lowStockItems = await Inventory.find({ 
            school: schoolId, 
            quantity: { $lt: MIN_STOCK_THRESHOLD } 
        }).sort({ quantity: 1 });
        
        res.status(200).json({
            success: true,
            count: lowStockItems.length,
            threshold: MIN_STOCK_THRESHOLD,
            items: lowStockItems
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching low stock items", error: err.message });
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
        const lowStockCount = items.filter(item => item.quantity < MIN_STOCK_THRESHOLD).length;
        const totalItems = items.length;

        res.send({ totalValue, lowStockCount, totalItems });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { 
    consumeItem, 
    addItem, 
    restockItem, 
    getInventoryList, 
    getLowStock,
    updateInventoryItem, 
    deleteInventoryItem, 
    getInventoryStats 
};
