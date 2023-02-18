import { requireAuthentication } from '../../hooks/requireAuthentication';

export default function Auth(component) {
  return <Component />;
}
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});
