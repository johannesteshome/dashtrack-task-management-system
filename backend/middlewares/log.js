const { LogModel } = require("../models/Log.model");
const { UserModel } = require("../models/User.model");
const { isTokenValid } = require("../utils");

const logActivity = (action) => {
  // roles param can be a single role, or an array of roles
  return async (req, res, next) => {
    // console.log(req.body.email);
    if (!req.user) {
      const user = await UserModel.findOne({ email: req.body.email });
      const log = await LogModel.create({
        username: user.name,
        email: user.email,
        userId: user._id,
        role: user.role,
        ipAddress: req.ip,
        action,
        time: new Date(),
      });
      next();
    }
    else {
      const log = await LogModel.create({
        username: req.user.name,
        email: req.user.email,
        userId: req.user._id,
        role: req.user.role,
        ipAddress: req.ip,
        action,
        time: new Date(),
      });
      next();
    }
  };
};

module.exports = {
  logActivity,
};
