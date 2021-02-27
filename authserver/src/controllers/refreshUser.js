export default function makeRefreshUser({ refresh, AppError }) {
  return async function refreshUser(req, res, next) {
    const token = req.body.token;

    if (!token) return next(new AppError(`No token was provided`, 400));

    const refreshed = await refresh({ token });

    if (!refreshed)
      return next(new AppError(`Could not refresh the user at this time`, 403));

    res.status(200).json(refreshed).send();
  };
}
