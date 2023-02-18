import { useState } from 'react';
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
import NavigationBar from '../NavigationBar/NavigationBar';
import Header from '../Header/Header';

export default function DefaultLayout({ children }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={<Header isOpen={opened} setOpen={setOpened} />}
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }

      navbar={<NavigationBar isOpen={opened} />}
    >
      {children}
      {/* <Text>Resize app to see responsive navbar in action</Text> */}
    </AppShell>
  );
}
