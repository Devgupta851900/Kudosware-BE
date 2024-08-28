// Created Instance
const express = require("express");
const app = express();

// loaded environment variables
require("dotenv").config();
const PORT = process.env.PORT || 4100;

// imported functions and parsers
const expressFileupload = require("express-fileupload");
const cors = require("cors");
const connect = require("./config/database");
const cloudinaryConnect = require("./config/cloudinary");
const userRoutes = require("./routes/userRoutes");

// implemented parser
app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://kudosware-seven.vercel.app/",
		],
		credentials: true,
	})
);
app.use(
	expressFileupload({
		useTempFiles: true,
		tempFileDir: "/tmp",
	})
);

app.use((req, res, next) => {
	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://kudosware-seven.vercel.app"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.use("/api/v1", userRoutes);

// database connect
connect();

// cloudinary Connection
cloudinaryConnect();

// default route

app.get("/", (req, res) => {
	res.send(`Your server is running at ${PORT}`);
});

// activate server

app.listen(PORT, () => {
	console.log(`App is Running at ${PORT}`);
});
