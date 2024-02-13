import DefaultLayout from '../components/Layouts/DefaultLayout';
import requireAuthentication from '../lib/requireAuthentication';

export default function App({ isAuth }) {
  return <DefaultLayout isAuth={isAuth} />;
}

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  return {
    props: {
      isAuth: req.cookies.urga_admin_user_jwt,
    },
  };
});
