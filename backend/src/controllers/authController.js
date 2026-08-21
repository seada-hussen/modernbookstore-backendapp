const { registerUserService, loginUserService } = require("../services/userService");

async function register(req, res, next) {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const data = await loginUserService(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};