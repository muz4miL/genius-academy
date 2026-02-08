const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
        unique: true
    },
    academicSettings: {
        defaultClassDuration: {
            type: Number, // minutes
            default: 45
        },
        breakDuration: {
            type: Number, // minutes
            default: 15
        },
        schoolStartTime: {
            type: String,
            default: "08:00 AM"
        },
        schoolEndTime: {
            type: String,
            default: "02:00 PM"
        },
        workingDays: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }]
    },
    seatingSettings: {
        seatsPerRow: {
            type: Number,
            default: 6
        },
        totalRows: {
            type: Number,
            default: 5
        },
        enableGenderSegregation: {
            type: Boolean,
            default: true
        }
    },
    feeSettings: {
        lateFeePercentage: {
            type: Number,
            default: 5
        },
        paymentMethods: [{
            type: String,
            enum: ['Cash', 'Bank Transfer', 'Online']
        }]
    },
    notificationSettings: {
        enableEmailNotifications: {
            type: Boolean,
            default: false
        },
        enableSMSNotifications: {
            type: Boolean,
            default: false
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("configuration", configurationSchema);
