import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      let errorStatus = 500;
      let errorMessage = 'Could not validate token';
      switch (err.name) {
        case 'TokenExpiredError':
          errorStatus = 401;
          errorMessage = err.message;
          break;
        case 'JsonWebTokenError':
          errorStatus = 403;
          errorMessage = err.message;
          break;
        case 'NotBeforeError':
          errorStatus = 500;
          errorMessage = 'Token is not valid yet, how did you get it?';
          break;
        default:
          break;
      }
      return res.status(errorStatus).json({ message: errorMessage }).send();
    }

    req.user = user;
    next();
  });
};

const authenticateRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to perform this action' })
        .send();
    }
    next();
  };
};

export { authenticateRole, authenticateUser };
