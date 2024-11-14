import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const verifyAdmin = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.admin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = user; 
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

export default verifyAdmin;
