export default function buildMakeRefresh({ Id, jwt, redisCache, AppError }) {
  return async function makeRefresh({ token }) {
    const user = await jwt.verifyToken(token);
    if (!user) throw 'No payload found, or could not verify refresh token';
    if (!Id.isValidId(user.refreshId))
      throw new AppError('Invalid refresh token', 401);

    const refreshToken = await redisCache
      .getToken(user.refreshId)
      .catch((error) => {
        throw error;
      });
    if (!refreshToken) throw new AppError('No token found', 403);

    const accessToken = jwt.generateAccessToken(user);
    if (!accessToken) throw 'Could not generate new access token';

    return { access: accessToken, refresh: refreshToken };
  };
}
