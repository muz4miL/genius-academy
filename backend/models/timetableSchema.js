const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'session',
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
    },
    periods: [{
        periodNumber: {
            type: Number,
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
            required: true
        },
        startTime: {
            type: String, // "09:00 AM"
            required: true
        },
        endTime: {
            type: String, // "09:45 AM"
            required: true
        },
        roomNumber: {
            type: String
        }
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
}, { timestamps: true });

// One timetable per class per day per session
timetableSchema.index({ sclass: 1, session: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model("timetable", timetableSchema);
