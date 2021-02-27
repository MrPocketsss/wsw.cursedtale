import crypto from 'crypto';
import { promisify } from 'util';

import buildMakeResetPassword from './reset-password.js';
import buildMakeForgotPassword from './forgot-password.js';
import buildMakeSignIn from './signIn.js';
import buildMakeSignOut from './signOut.js';
import buildMakeSignUp from './signUp.js';
import buildMakeRefresh from './refresh.js';
import { UserModel, redisCache, jwt } from '../data-access/index.js';
import { AppError } from '../error-handling/index.js';
import sendEmail from './send-email.js';
import Id from '../Id/index.js';

const randomBytesAsync = promisify(crypto.randomBytes);

const makeForgotPassword = buildMakeForgotPassword({
  AppError,
  randomBytesAsync,
  sendEmail,
  UserModel,
});
const makeResetPassword = buildMakeResetPassword({ AppError, UserModel });
const makeSignIn = buildMakeSignIn({
  AppError,
  Id,
  jwt,
  redisCache,
  UserModel,
});
const makeSignUp = buildMakeSignUp({ AppError, UserModel });
const makeSignOut = buildMakeSignOut({ AppError, Id, jwt, redisCache });
const makeRefresh = buildMakeRefresh({ AppError, Id, jwt, redisCache });

const useCases = Object.freeze({
  makeForgotPassword,
  makeResetPassword,
  makeSignIn,
  makeSignUp,
  makeSignOut,
  makeRefresh,
});

export default useCases;
