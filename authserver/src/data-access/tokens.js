import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) => {
  delete payload.refreshId;
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
};
const generateTokens = (payload) => {
  const access = generateAccessToken(payload);
  const refresh = generateRefreshToken(payload);

  return { access, refresh };
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) throw err;
    return user;
  });
};

const jwtHandler = Object.freeze({
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
});

export default jwtHandler;
