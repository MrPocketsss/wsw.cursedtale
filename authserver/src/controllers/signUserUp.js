export default function makeSignUserUp({ signUp, AppError }) {
  return async function signUserUp(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if (!email) return next(new AppError(`No email provided`, 400));
    if (!password) return next(new AppError(`No password provided`, 400));
    if (!role) return next(new AppError(`No role provided`, 400));

    const signedUp = await signUp({ email, password, role });

    if (!signedUp) return next(new AppError(`Could not sign the user up`, 401));

    res.sendStatus(201);
  };
}
