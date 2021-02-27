export default function makeSignUserOut({ signOut, AppError }) {
  return async function signUserOut(req, res, next) {
    const token = req.body.token;

    if (!token) return next(new AppError(`No token provided`, 400));

    const signedOut = await signOut({ token });

    if (!signedOut)
      return next(new AppError(`Could not sign the user out right now`, 403));

    res.sendStatus(204);
  };
}
