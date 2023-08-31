import {
  AppShell,
  Navbar,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import Header from '../components/Header/Header';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { getCookie, getCookies } from 'cookies-next';
import requireAuthentication from '../lib/requireAuthentication';

export default function App() {
  return <DefaultLayout />;
}
export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  return {
    props: {},
  };
});
