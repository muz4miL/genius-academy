const Fee = require('../../models/feeSchema');
const Student = require('../../models/studentSchema');
const crypto = require('crypto');

// Collect Fee Payment
const collectFee = async (req, res) => {
    try {
        const { feeId, amount, paymentMethod } = req.body;
        const adminId = req.user.id;
        
        const fee = await Fee.findById(feeId).populate('student', 'name rollNum');
        
        if (!fee) {
            return res.status(404).json({ message: "Fee record not found" });
        }
        
        // Validation
        const remainingAmount = fee.amount - fee.paidAmount;
        if (amount > remainingAmount) {
            return res.status(400).json({
                message: "Amount exceeds remaining balance",
                remainingBalance: remainingAmount
            });
        }
        
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }
        
        // Generate transaction ID and receipt number
        const transactionId = crypto.randomUUID();
        const receiptNumber = `REC-${Date.now()}`;
        
        // Audit trail
        fee.paymentHistory.push({
            amount: amount,
            paidAt: new Date(),
            paymentMethod: paymentMethod || 'Cash',
            receivedBy: adminId,
            receiptNumber: receiptNumber
        });
        
        // Update paid amount
        fee.paidAmount += amount;
        
        // Update status
        if (fee.paidAmount >= fee.amount) {
            fee.status = 'Paid';
        }
        
        await fee.save();
        
        // Generate receipt
        const receipt = {
            receiptNumber: receiptNumber,
            transactionId: transactionId,
            studentName: fee.student.name,
            rollNumber: fee.student.rollNum,
            feeType: fee.feeType,
            month: fee.month,
            amountPaid: amount,
            paymentMethod: paymentMethod || 'Cash',
            remainingBalance: Math.max(0, fee.amount - fee.paidAmount),
            paidAt: new Date(),
            receivedBy: adminId
        };
        
        res.status(200).json({
            success: true,
            message: "Payment recorded successfully",
            receipt: receipt
        });
    } catch (err) {
        res.status(500).json({ message: "Error collecting fee", error: err.message });
    }
};

// Generate Monthly Fees (Batch Operation)
const generateFees = async (req, res) => {
    try {
        const { sessionId, month, amount } = req.body;
        const schoolId = req.user.schoolId;
        
        // Get all students in active session
        const students = await Student.find({ 
            school: schoolId, 
            currentSession: sessionId 
        });
        
        if (students.length === 0) {
            return res.status(404).json({ 
                message: "No students found for the specified session" 
            });
        }
        
        const fees = [];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        
        for (const student of students) {
            fees.push({
                student: student._id,
                sclass: student.sclassName,
                session: sessionId,
                school: schoolId,
                month: month,
                feeType: 'Tuition',
                amount: amount,
                status: 'Pending',
                paidAmount: 0,
                dueDate: dueDate,
                paymentHistory: []
            });
        }
        
        const createdFees = await Fee.insertMany(fees);
        
        res.status(201).json({
            success: true,
            message: `Fees generated for ${createdFees.length} students`,
            count: createdFees.length
        });
    } catch (err) {
        res.status(500).json({ message: "Error generating fees", error: err.message });
    }
};

// Get Student's Fee History
const getStudentFees = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const fees = await Fee.find({ student: studentId })
            .populate('student', 'name rollNum')
            .populate('sclass', 'sclassName')
            .sort({ month: -1 });
        
        res.status(200).json({
            success: true,
            fees: fees
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching student fees", error: err.message });
    }
};

// Get All Pending Fees for a School
const getPendingFees = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        const pendingFees = await Fee.find({ 
            school: schoolId, 
            status: 'Pending' 
        })
        .populate('student', 'name rollNum')
        .populate('sclass', 'sclassName')
        .sort({ dueDate: 1 });
        
        res.status(200).json({
            success: true,
            count: pendingFees.length,
            fees: pendingFees
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching pending fees", error: err.message });
    }
};

module.exports = { 
    collectFee, 
    generateFees, 
    getStudentFees, 
    getPendingFees 
};
