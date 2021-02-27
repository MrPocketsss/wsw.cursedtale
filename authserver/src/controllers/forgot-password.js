export default function makeSendForgotPassword({ AppError, forgotPassword }) {
  return async function sendForgotPassword(req, res, next) {
    const email = req.body.email;

    if (!email) return next(new AppError(`No email was provided`, 401));

    const forgotSuccess = await forgotPassword(email);

    if (!forgotSuccess)
      return next(
        new AppError(`Could not send recovery email at this time`, 500)
      );

    res.sendStatus(204);
  };
}
