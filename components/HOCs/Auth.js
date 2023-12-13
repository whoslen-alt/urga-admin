import { requireAuthentication } from '../../hooks/requireAuthentication';

export default function Auth({ children }) {
  return children;
}
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});
