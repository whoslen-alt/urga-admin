import { serialize } from 'cookie';

export default async function handler(req, res) {
  const { cookies } = req;

  const jwt = cookies.urga_admin_user_jwt;

  if (!jwt) {
    return res.status(401).json({ success: false, message: 'Not logged in.' });
  } else {
    const serialised = serialize('urga_admin_user_jwt', null, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: -1,
      path: '/',
    });

    res.setHeader('Set-Cookie', serialised);

    res.status(200).json({ success: true, message: 'Successfuly logged out!' });
  }
}
