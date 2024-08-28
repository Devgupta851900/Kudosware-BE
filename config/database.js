const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
	mongoose
		.connect(process.env.DB_URL)
		.then(() => {
			console.log("DATABASE Connected Successfully");
		})
		.catch((e) => {
			console.log(e);
			console.log("DATABASE Connection Issues");
			process.exit(1);
		});
};

module.exports = connect;
