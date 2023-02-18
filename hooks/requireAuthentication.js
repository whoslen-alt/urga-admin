export function requireAuthentication(gssp) {
  return async (context) => {
    const { req } = context;
    const token = req.cookies.token;

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
