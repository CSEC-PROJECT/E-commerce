import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) return res.status(401).json({ message: "Unauthorized" });
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

export const authorize = (requiredRoles = []) => {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ message: "Unauthorized" });
		const userRoles = req.user.role || [];
		const hasRole = requiredRoles.some((r) => userRoles.includes(r));
		if (!hasRole) return res.status(403).json({ message: "Forbidden" });
		next();
	};
};

export default { authenticate, authorize };

