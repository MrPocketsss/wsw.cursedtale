export default function makeSignUserIn({ signIn, AppError }) {
  return async function signUserIn(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) return next(new AppError(`No email provided`, 400));
    if (!password) return next(new AppError(`No password provided`, 400));

    const signedIn = await signIn({ email, password });

    if (!signedIn) return next(new AppError(`Invalid email/password`, 401));

    res.status(200).json(signedIn);
  };
}
