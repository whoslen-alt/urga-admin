export default function requireAuthentication(gssp) {
  return async (context) => {
    const { req } = context;
    const token = req.cookies.urga_admin_user_jwt;
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return await gssp(context); // Continue on to call `getServerSideProps` logic
  };
}
