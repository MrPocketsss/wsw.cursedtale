export default function buildMakeSignIn({
  AppError,
  UserModel,
  redisCache,
  Id,
  jwt,
}) {
  return async function ({ email, password }) {
    try {
      const user = await UserModel.findOne({ email }).exec();
      if (!user) throw new AppError('invalid email/password', 401);

      const isValidUser = await user.comparePassword(password);
      if (!isValidUser) throw new AppError('invalid email/password', 401);

      const id = Id.makeId();
      if (!id) throw new Error('Could not genereate cuid');

      const tokens = jwt.generateTokens({
        email: user.email,
        createdOn: user.createOn,
        role: user.role,
        refreshId: id,
      });
      if (!tokens) throw new Error('Could not generate tokens');

      await redisCache.setToken(id, tokens.refresh).catch((error) => {
        throw error;
      });

      return tokens;
    } catch (error) {
      throw error;
    }
  };
}
