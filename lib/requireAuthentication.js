export default function requireAuthentication(gssp) {
  return async (context) => {
    const { req, res } = context;
    const token = req.cookies.urga_admin_user_jwt;

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          statusCode: 302,
        },
      };
    }

    return await gssp(context); // Continue on to call `getServerSideProps` logic
  };
}
