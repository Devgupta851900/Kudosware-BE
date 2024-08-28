const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			trim: true,
			default: "",
		},
		phoneNumber: {
			type: Number,
			required: true,
		},
		password: {
			type: String,
			require: true,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
			required: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		resume: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userModel);
