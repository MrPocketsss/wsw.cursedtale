export default function buildMakeSignUp({ UserModel }) {
  return async function ({ email, password, role }) {
    console.log(`email: ${email}, password: ${password}, role: ${role}`);
    const user = new UserModel({ email, password, role });
    user.save((error) => {
      if (error) throw error;
    });
    if (!user) throw new Error('Cannot create user right now');
    return true;
  };
}
