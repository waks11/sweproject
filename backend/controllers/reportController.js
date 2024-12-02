import { Report } from "../models/reportModel.js";

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

const getReports = async (req, res) => {
    
    const { page, limit } = req.query;

    try {
        
        const totalDocuments = await Report.countDocuments();
    
        if(totalDocuments === 0) {
            res.status(200).json({reports: [], hasMore: false});
            return;
        }

        const start = (page - 1) * limit;

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
