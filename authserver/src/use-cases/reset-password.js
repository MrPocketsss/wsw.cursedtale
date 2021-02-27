export default function buildMakeResetPassword({ AppError, UserModel }) {
  return async function makeResetPassword(token, newPassword) {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).exec();
    if (!user)
      throw new AppError('Password reset token is invalid or has expired', 403);

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save();

    return true;
  };
}
