const router = require("express").Router();
const { login, signup, updateUserDetail } = require("../controllers/User");
const { auth } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/updateUser", auth, updateUserDetail);

module.exports = router;
