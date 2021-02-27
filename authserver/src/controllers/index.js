import makeForgotPassword from './forgot-password.js';
import makeResetUserPassword from './reset-password.js';
import makeSignUserIn from './signUserIn.js';
import makeSignUserUp from './signUserUp.js';
import makeSignUserOut from './signUserOut.js';
import makeRefreshUser from './refreshUser.js';
import useCases from '../use-cases/index.js';
import { AppError } from '../error-handling/index.js';

const forgotPassword = useCases.makeForgotPassword;
const resetPassword = useCases.makeResetPassword;
const signIn = useCases.makeSignIn;
const signOut = useCases.makeSignOut;
const signUp = useCases.makeSignUp;
const refresh = useCases.makeRefresh;

const resetUserPassword = makeResetUserPassword({ AppError, resetPassword });
const sendForgotPassword = makeForgotPassword({ AppError, forgotPassword });
const signUserIn = makeSignUserIn({ signIn, AppError });
const signUserOut = makeSignUserOut({ signOut, AppError });
const signUserUp = makeSignUserUp({ signUp, AppError });
const refreshUser = makeRefreshUser({ refresh, AppError });

const controllers = Object.freeze({
  resetUserPassword,
  sendForgotPassword,
  signUserIn,
  signUserOut,
  signUserUp,
  refreshUser,
});

export default controllers;
