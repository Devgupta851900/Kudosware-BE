const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

exports.signup = async (req, res) => {
	try {
		// fetch data
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
			return res.status(403).json({
				success: false,
				message: "All Fields are required",
			});
		}

		// checking if both the password matches or not

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password doesn't matched, Try Again",
			});
		}

		// checking if user already exists
		const userExist = await User.findOne({ email });

		if (userExist) {
			return res.status(401).json({
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

		// creating a DB entry

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

		return res.status(200).json({
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
		// fetch email and password
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(403).json({
				success: false,
				message: "Email and Password are required Field",
			});
		}

		// checking if user with the email exists
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User Does not exist",
			});
		}

		// comparing password
		if (!bcrypt.compare(user.password, password)) {
			return res.status(401).json({
				success: false,
				message: "Incorrect Password",
			});
		}

		// if user exist and password is correct. then, return a JWT token for future authentication
		// creating Token
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
		const { name, dob, address, bio } = req.body;

		const resume = req.files?.resume;

		const id = req.user.id;
		const user = await User.findById(id);

		if (!user) {
			return res.status(500).json({
				success: false,
				message: "User does not exist",
			});
		}

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

		if (resume && user.resume !== resume) {
			const uploadedResume = await cloudinaryUpload(
				resume,
				process.env.CLOUDINARY_FOLDER
			);

			user.resume = uploadedResume.secure_url;
		}

		const updatedUser = await user.save();

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
