export default function buildMakeUserResetPassword({
  AppError,
  resetPassword,
}) {
  return async function resetUserPassword(req, res, next) {
    const token = req.body.token;
    const newPassword = req.body.password;

    if (!token) return next(new AppError(`No reset token was provided`, 401));
    if (!newPassword)
      return next(new AppError(`No password was provided`, 401));

    const resetSuccess = await resetPassword(token, newPassword);

    if (!resetSuccess)
      return next(new AppError(`Could not reset password`, 500));

    res.sendStatus(204);
  };
}
