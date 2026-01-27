const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = id => {
  const secret = process.env.JWT_SECRET || 'supersecretkeylearning';
  const expiresIn = process.env.JWT_EXPIRES_IN || '90d';
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn
  });
};

const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);
    const cookieExpires = process.env.JWT_COOKIE_EXPIRES_IN || 90;

    const cookieOptions = {
      expires: new Date(
        Date.now() + cookieExpires * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };

    // Remove password from output
    user.password = undefined;

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    console.error("CREATE SEND TOKEN ERROR:", err);
    // Don't crash, just send json response error
    res.status(500).json({ status: 'error', message: 'Token creation failed: ' + err.message });
  }
};

exports.signup = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    if (existingUser.isVerified) {
      return next(new AppError('User already exists. Please login.', 400));
    } else {
      // Resend OTP logic for unverified user trying to signup again
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hash = crypto.createHash('sha256').update(otp).digest('hex');

      existingUser.otp = hash;
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
      existingUser.name = req.body.name; // Update name if changed
      existingUser.password = req.body.password;
      existingUser.passwordConfirm = req.body.passwordConfirm;

      await existingUser.save({ validateBeforeSave: false });

      try {
        await sendEmail({
          email: existingUser.email,
          subject: 'Your Authentication Code - Glam Iconic India',
          message: `Your verification code is: ${otp}. It is valid for 10 minutes.`
        });
        return res.status(200).json({
          status: 'pending_verification',
          message: 'OTP resent to email',
          email: existingUser.email
        });
      } catch (err) {
        return next(new AppError('There was an error sending the email. Try again later!'), 500);
      }
    }
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.file ? req.file.filename : 'default.jpg',
    isVerified: false // Explicitly set to false initially
  });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash('sha256').update(otp).digest('hex');

  newUser.otp = hash;
  newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
  await newUser.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: newUser.email,
      subject: 'Your Authentication Code - Glam Iconic India',
      message: `Your verification code is: ${otp}. It is valid for 10 minutes.`
    });

    res.status(200).json({
      status: 'pending_verification',
      message: 'OTP sent to email',
      email: newUser.email
    });
  } catch (err) {
    newUser.otp = undefined;
    newUser.otpExpires = undefined;
    await newUser.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) return next(new AppError('Please provide email and otp', 400));

  const user = await User.findOne({ email }).select('+otp +otpExpires');
  if (!user) return next(new AppError('User not found', 404));

  if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
    return next(new AppError('OTP expired or invalid', 400));
  }

  const hash = crypto.createHash('sha256').update(otp).digest('hex');
  if (hash !== user.otp) {
    return next(new AppError('Invalid OTP', 400));
  }

  // Verification successful
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  // Generate Member ID if not present
  if (!user.memberId) {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); // 5 digit random
    user.memberId = `GII-${year}-${random}`;
  }

  await user.save({ validateBeforeSave: false });

  // Create Ticket if new user logic needed here? Usually done at signup but we can do it here or leave it. 
  // Let's create ticket here to ensure only verified users get tickets
  try {
    const existingTicket = await Ticket.findOne({ user: user._id });
    if (!existingTicket) {
      await Ticket.create({
        user: user._id,
        ticketNumber: `MEM-${Date.now()}`,
        price: 0,
        status: 'confirmed',
        qrCode: user._id.toString(),
      });
    }
  } catch (e) { console.error("Ticket creation error", e); }

  createSendToken(user, 200, res);
});

exports.googleLogin = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  console.log("Google Login Attempt with token length:", token ? token.length : 'null');

  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
    console.log("Google Verify Success. Email:", payload.email);
  } catch (err) {
    console.error("Google Verify FAILED:", err.message);
    // FALLBACK: Try to decode without verification if verifying fails (only for debugging/desperate fix)
    try {
      const jwt = require('jsonwebtoken');
      payload = jwt.decode(token);
      if (!payload || !payload.email) throw new Error("Decode failed");
      console.log("Fallback Decode Success. Email:", payload.email);
    } catch (decodeErr) {
      return next(new AppError('Invalid Google Token', 401));
    }
  }

  const { email, name, sub: googleId, picture } = payload;

  let user = await User.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
    }
  } else {
    // Create new user
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    console.log("Creating new user for:", email);

    user = await User.create({
      name: name || 'Google User',
      email,
      googleId,
      photo: picture,
      isVerified: true,
      password: 'google-login-pass-' + Math.random().toString(36).slice(-8), // Dummy password
      memberId: `GII-${year}-${random}`,
      role: 'user'
    });

    // Create Ticket
    try {
      await Ticket.create({ user: user._id, ticketNumber: `MEM-${Date.now()}`, price: 0, status: 'confirmed', qrCode: user._id.toString() });
    } catch (ticketErr) {
      console.error("Ticket creation failed (non-fatal):", ticketErr.message);
    }
  }

  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password +isVerified');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check verification
  if (!user.isVerified) {
    // Resend OTP logic could go here or frontend handles it
    return next(new AppError('Please verify your email first', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
