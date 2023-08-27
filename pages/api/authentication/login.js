import axios from 'axios';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  const { username, password } = req.body;

  try {
    const result = await axios.post(`${process.env.API_URL}/admin/login`, { username, password });
    if (result.status === 200 && result.data?.success) {
      const userToken = result.data.token;
      const serialised = serialize('urga_admin_user_jwt', userToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      res.setHeader('Set-Cookie', serialised);
      res.status(200).json({ success: true });
    } else {
      res.status(result.status).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    if (err.response) {
      res.status(500).json({ error: err, message: err.response.data.message });
      return;
    }
    res.status(500).json({ error: err, message: err.message });
  }
}
