const { registerUserService, loginUserService, getUserByIdService } = require("../services/userService");

const sessionCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
});

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
    res.cookie('bookstore_session', data.token, sessionCookieOptions());
    res.json({ success: true, data: { user: data.user } });
  } catch (error) {
    next(error);
  }
}

async function currentUser(req, res, next) {
  try {
    const user = await getUserByIdService(req.user.id);
    if (!user) return res.status(401).json({ success: false, message: 'Account no longer exists' });
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  const { maxAge, ...clearOptions } = sessionCookieOptions();
  res.clearCookie('bookstore_session', clearOptions);
  res.json({ success: true, message: 'Signed out' });
}

module.exports = {
  register,
  login,
  currentUser,
  logout,
};
