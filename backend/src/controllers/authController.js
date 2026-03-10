const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!user.isActive) {
      const error = new Error("Your account has been deactivated");
      error.statusCode = 403;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    user.lastLogin = Date.now();
    await user.save();

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully",
      token: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    //verify if user exists
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      return next(error);
    }

    const resetToken = crypto.randomBytes(32).toString("base64");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("base64");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    //send token

    const resetUrl = `https://zeeltech.com${resetToken}`;

    try {
      await transporter.sendMail({
        from: '"My App Support" <support@zeeltech.com>',
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset it.</p>
    <p>This link expires in 15 minutes.</p>`,
      });
      res.json({ success: true, message: "Password reset email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      const err = new Error("Email could not be sent");
      err.statusCode = 500;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    // get token from params and hash it
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("base64");

    // find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired reset token");
      error.statusCode = 400;
      return next(error);
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => { 
    if (!req.user) {
        const error = new Error('Not authorized');
        error.statusCode = 401;
        return next(error); 
    }

    res.status(200).json({
    success: true,
    data: req.user
  });
}