const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

exports.signup = async (req, res) => {
	try {
		// Fetch data from request body
		const {
			name,
			email,
			password,
			confirmPassword,
			phoneNumber,
			address,
			dob,
			bio,
		} = req.body;

		const { resume } = req.files;

		// console.log(
		// 	name,
		// 	email,
		// 	password,
		// 	confirmPassword,
		// 	phoneNumber,
		// 	address,
		// 	dob,
		// 	resume,
		// 	bio
		// );

		// Check if all required fields are provided
		if (
			!name ||
			!email ||
			!password ||
			!confirmPassword ||
			!phoneNumber ||
			!address ||
			!dob ||
			!resume
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are required",
			});
		}

		// Verify if passwords match

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password doesn't matched, Try Again",
			});
		}

		// Check if user already exists
		const userExist = await User.findOne({ email });

		if (userExist) {
			return res.status(409).json({
				success: false,
				message: "User Already Exists",
			});
		}

		// hash the password

		const hashedPassword = await bcrypt.hash(password, 10);

		// uploading resume to cloudinary

		const uploadedResume = await cloudinaryUpload(
			resume,
			process.env.CLOUDINARY_FOLDER
		);

		// Create a new user entry in the database

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			bio: bio,
			phoneNumber,
			address,
			dob,
			resume: uploadedResume.url,
		});

		// return response

		return res.status(201).json({
			success: true,
			message: "User Registered Successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error, Try Again",
			error: error.message,
		});
	}
};

exports.login = async (req, res) => {
	try {
		// Fetch email and password from request body
		const { email, password } = req.body;

		// Check if email and password are provided
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and Password are required Field",
			});
		}

		// Check if user with the provided email exists
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User Does not exist",
			});
		}

		// Compare provided password with stored hashed password
		if (!bcrypt.compare(user.password, password)) {
			return res.status(401).json({
				success: false,
				message: "Incorrect Password",
			});
		}

		// Create a JWT token for future authentication
		const jwtPayload = {
			id: user._id,
			email: user.email,
		};

		const token = await jwt.sign(jwtPayload, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

		user = user.toObject();
		user.token = token;
		user.password = undefined;

		// Return success response with user data and token
		return res.status(200).json({
			success: true,
			message: "Login Successfull",
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error, Try Again",
			error: error.message,
		});
	}
};

exports.updateUserDetail = async (req, res) => {
	try {
		// Fetch updated user data from request body
		const { name, dob, address, bio } = req.body;

		const id = req.user.id;
		const user = await User.findById(id);

		// Check if user exists in the database
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User does not exist",
			});
		}

		// Update user details
		if (user.name !== name) {
			user.name = name;
		}

		if (user.dob !== dob) {
			user.dob = dob;
		}

		if (user.address !== address) {
			user.address = address;
		}

		if (user.bio !== bio) {
			user.bio = bio;
		}

		// Save updated user data
		const updatedUser = await user.save();

		// Return success response with updated user data
		return res.status(200).json({
			success: true,
			message: "User Data Updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
