import { LostItem } from "../models/itemModel.js";


const createPost = async (req, res) => {

    console.log(req.file);

    const { user_id, description, location } = req.body;

    const image_url = req.file?.location;

    try {
        const item = await LostItem.create({ user_id, image_url, description, location });
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

};

export default createPost;

