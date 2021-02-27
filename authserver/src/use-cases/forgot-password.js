export default function buildForgotPassword({
  AppError,
  randomBytesAsync,
  sendEmail,
  UserModel,
}) {
  return async function forgotPassword(email) {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) throw new AppError('invalid email/password', 401);

    const token = await randomBytesAsync(20).toString('hex');
    if (!token || typeof token !== 'string')
      throw new AppError('An error occurred', 500);

    user.resetPasswordToken = token;
    user.resetPasswordExpires =
      Date.now() + parseInt(process.env.FORGOT_PASSWORD_EXPIRES_IN, 10);

    user.save();

    const emailSent = sendEmail(email, token);
    if (!emailSent) throw new AppError('Could not send an email', 500);

    return true;
  };
}
