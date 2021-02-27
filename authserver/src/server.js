// import node modules
import path from 'path';

// import modules
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';

// import project files
import errorHandler, { AppError, catchAsync } from './error-handling/index.js';
import controllers from './controllers/index.js';
import { authenticateRole, authenticateUser } from './permissions/index.js';

//=============================================================================
//                          Handle any uncaught errors
//=============================================================================
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

//=============================================================================
//                          Set up global variables
//=============================================================================
const PORT = process.env.PORT || 9000;
const __dirname = path.resolve();
const accessLogStream = rfs.createStream('access.log', {
  compress: 'gzip', // compress rotated files
  interval: '1d', // rotate daily
  maxSize: '1G', // max size of rotated files to keep
  path: path.join(__dirname, 'logs'), // path to log directory
  size: '10M', // rotate every 10 MegaBytes written
});

//=============================================================================
//                          Set up express server
//=============================================================================
const app = express();

// express middleware
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express router
app.post('/signin', catchAsync(controllers.signUserIn));
app.post(
  '/signup',
  authenticateUser,
  authenticateRole('ADMIN'),
  catchAsync(controllers.signUserUp)
);
app.delete('/signout', catchAsync(controllers.signUserOut));
app.post('/refresh', catchAsync(controllers.refreshUser));
app.post('/forgot-password', catchAsync(controllers.sendForgotPassword));
app.post('/reset', catchAsync(controllers.resetUserPassword));

// catch unexpected routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// process all express errors
app.use(errorHandler());

//=============================================================================
//                          Handle any rejections not caught above
//=============================================================================
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);
});

//=============================================================================
//                          Hook up mongoose and start server
//=============================================================================
mongoose.connect(
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongoDB:27017/users?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.log(error);
      app.listen(PORT, () =>
        console.log(`Server is running on ${PORT} WITHOUT MONGO`)
      );
    } else {
      console.log('CONNECTED TO MONGODB');
      app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
    }
  }
);
