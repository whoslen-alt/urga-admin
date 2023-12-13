import DefaultLayout from '../components/Layouts/DefaultLayout';
import requireAuthentication from '../lib/requireAuthentication';

export default function App() {
  return <DefaultLayout />;
}

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  return {
    props: {},
  };
});
