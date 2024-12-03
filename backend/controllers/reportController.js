import { Report } from "../models/reportModel.js";

// Reports a user for suspicious user
const createReport = async (req, res) => {

    const { reporterId, reportedUserId, reportedConversationId, reportedDescription } = req.body;

    try {
        const newReport = await Report.create({ 
            reporterId,
            reportedUserId,
            reportedConversationId,
            reportedDescription
        });
    
        res.status(200).json(newReport);
    } catch (error) {
        res.status(500).json({ message: "Failed to Create a Report", error });
    }

};

// Returns all reports that are currently in the database
// Uses pagination for lazy loading on the frontend
const getReports = async (req, res) => {
    
    const { page, limit } = req.query;

    try {
        
        const totalDocuments = await Report.countDocuments();
    
        if(totalDocuments === 0) {
            res.status(200).json({reports: [], hasMore: false});
            return;
        }

        const start = (page - 1) * limit;

        // Since we have references to the User database here, we can populate the corresponding firstname
        // and lastname for each id associated with this Report
        const reports = await Report.find().sort({ _id: -1 }).skip(start).limit(limit).populate({
            path: 'reporterId',
            select: 'firstName lastName'
        }).populate({
            path: 'reportedUserId',
            select: 'firstName lastName'
        });
        
        const hasMore = (page * limit < totalDocuments);

        res.status(200).json({ reports, hasMore });

    } catch(error) {
        res.status(500).json({ error: error.message });
    }

};

export { createReport, getReports };
