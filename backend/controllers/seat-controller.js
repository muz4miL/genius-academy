const Seat = require('../models/seatSchema');
const Student = require('../models/studentSchema');

// Get All Seats for a Class (Create defaults if not exist)
const getSeatsByClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const seats = await Seat.find({ sclass: classId }).sort({ seatNumber: 1 });

        if (seats.length === 0) {
            // Initialize 30 seats if none exist for this class
            const newSeats = [];
            for (let i = 1; i <= 30; i++) {
                newSeats.push({
                    sclass: classId,
                    seatNumber: i,
                    isTaken: false,
                    student: null
                });
            }
            const createdSeats = await Seat.insertMany(newSeats);
            return res.send(createdSeats);
        }

        res.send(seats);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Book a Seat
const bookSeat = async (req, res) => {
    try {
        const { seatId, studentId } = req.body;

        // Unbook previous seat for this student if any
        await Seat.updateMany({ student: studentId }, { $set: { isTaken: false, student: null } });

        // Book new seat
        const seat = await Seat.findByIdAndUpdate(
            seatId,
            { isTaken: true, student: studentId },
            { new: true }
        );

        res.send(seat);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { getSeatsByClass, bookSeat };
