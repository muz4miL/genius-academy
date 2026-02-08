const Session = require('../models/sessionSchema');

// Initialize Session
const initializeSession = async (req, res) => {
    const { sessionName, startDate, endDate } = req.body;
    const schoolId = req.user.schoolId;
    
    try {
        // CRITICAL: Deactivate all previous sessions for this school
        await Session.updateMany(
            { school: schoolId, isActive: true },
            { isActive: false }
        );
        
        // Create new session
        const newSession = new Session({
            sessionName: sessionName,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            school: schoolId
        });
        
        await newSession.save();
        
        res.status(201).json({
            success: true,
            message: "New session initialized successfully. Previous sessions deactivated.",
            session: newSession
        });
        
    } catch (err) {
        res.status(500).json({ message: "Error initializing session", error: err.message });
    }
};

// Get Active Session
const getActiveSession = async (req, res) => {
    try {
        const schoolId = req.user?.schoolId || req.headers['x-school-id'];
        
        if (!schoolId) {
            return res.status(400).json({ message: "School ID is required" });
        }
        
        const activeSession = await Session.findOne({ 
            school: schoolId, 
            isActive: true 
        });
        
        if (!activeSession) {
            return res.status(404).json({ 
                message: "No active session found" 
            });
        }
        
        res.status(200).json({
            success: true,
            session: activeSession
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching active session", error: err.message });
    }
};

// Activate a Specific Session
const activateSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const schoolId = req.user.schoolId;
        
        // First, verify the session belongs to this school
        const session = await Session.findOne({ _id: sessionId, school: schoolId });
        
        if (!session) {
            return res.status(404).json({ 
                message: "Session not found or does not belong to this school" 
            });
        }
        
        // CRITICAL: Deactivate all sessions for this school
        await Session.updateMany(
            { school: schoolId, isActive: true },
            { isActive: false }
        );
        
        // Activate the specified session
        session.isActive = true;
        await session.save();
        
        res.status(200).json({
            success: true,
            message: "Session activated successfully. Previous sessions deactivated.",
            session: session
        });
    } catch (err) {
        res.status(500).json({ message: "Error activating session", error: err.message });
    }
};

// List All Sessions for a School
const listSessions = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        const sessions = await Session.find({ school: schoolId })
            .sort({ startDate: -1 });
        
        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions: sessions
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching sessions", error: err.message });
    }
};

module.exports = { 
    initializeSession, 
    getActiveSession, 
    activateSession, 
    listSessions 
};
