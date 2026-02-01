const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Asset', 'Supply'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unitPrice: {
        type: Number,
        required: true,
        default: 0
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("inventory", inventorySchema);
