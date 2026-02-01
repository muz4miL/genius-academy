const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    isTaken: {
        type: Boolean,
        default: false
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        default: null
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
});

module.exports = mongoose.model("seat", seatSchema);
