import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req: any, res: any) {
    await handleLogin(req, res, {
      returnTo: "/home",
    });
  },
});