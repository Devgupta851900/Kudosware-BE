const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
	try {
		// Extract token from the Authorization header
		const authHeader = req.header("Authorization");

		// Check if Authorization header is present and formatted correctly
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Authorization header is missing or invalid",
			});
		}

		// Extract the token from the header
		const token = authHeader.split(" ")[1];
		// Check if token is present
		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Token is missing",
			});
		}

		// Verify the token
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded; // Attach the decoded user info to the request object
			next(); // Proceed to the next middleware or route handler
		} catch (err) {
			// Handle specific JWT errors
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({
					success: false,
					message: "Token has expired",
				});
			}
			// Handle invalid token error
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
