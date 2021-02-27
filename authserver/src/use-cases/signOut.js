export default function buildMakeSignOut({ AppError, Id, jwt, redisCache }) {
  return async function makeSignOut({ token }) {
    const { refreshId } = await jwt.verifyToken(token);
    if (!refreshId) throw new AppError('Invalid token', 400);
    if (!Id.isValidId(refreshId)) throw new AppError('Not a valid id', 401);

    const deleteFlag = await redisCache.deleteToken(refreshId);
    if (!deleteFlag) throw new Error('could not delete token');

    return true;
  };
}
