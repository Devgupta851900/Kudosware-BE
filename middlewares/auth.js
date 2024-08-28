const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
	try {
		// Extract token
		const authHeader = req.header("Authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Authorization header is missing or invalid",
			});
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Token is missing",
			});
		}

		// Verify token
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			next();
		} catch (err) {
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({
					success: false,
					message: "Token has expired",
				});
			}
			return res.status(401).json({
				success: false,
				message: "Invalid token",
				error: err.message,
			});
		}
	} catch (error) {
		console.error("Error in auth middleware:", error);
		return res.status(500).json({
			success: false,
			message: "An error occurred while verifying the token",
			error: error.message,
		});
	}
};
