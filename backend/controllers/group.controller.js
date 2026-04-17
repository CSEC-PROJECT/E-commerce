export const checkInGroup = async (req, res) => {
    try {
        const data = req.body.groupDetails;

        if (!data || typeof data !== 'object') {
            return res.status(400).json({ message: "Invalid group data provided" });
        }

        const keys = Object.keys(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const group = await Group.findById(req.params.id);

// ADD THIS CHECK before using Object.keys()
if (!group) {
    return res.status(404).json({ message: "Group not found" });
}

const fields = Object.keys(group.toObject());