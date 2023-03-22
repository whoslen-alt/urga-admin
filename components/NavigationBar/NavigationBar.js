import Link from 'next/link';
import { Flex, Group, Navbar, NavLink, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import Image from 'next/image';
import { MainLinks } from './MainLinks/MainLinks';
import { IconLogout } from '@tabler/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
function NavigationBar({ isOpen }) {
  const router = useRouter();
  const handleLogout = async () => {
    axios
      .get('api/auth/logout')
      .then((value) => {
        router.reload();
      })
      .catch((err) => {});
  };
  return (
    <Navbar p="sm" hiddenBreakpoint="sm" hidden={!isOpen} width={{ sm: 200, lg: 250 }}>
      <Navbar.Section grow mt="sm">
        <MainLinks />
      </Navbar.Section>
      <UnstyledButton
        onClick={handleLogout}
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.red[7],
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.red[1],
            outline: 'none',
          },
          '&:focus': {
            outline: 'none',
          },
        })}
      >
        <Group>
          <ThemeIcon variant="light" color="red">
            <IconLogout size={16} />
          </ThemeIcon>
          <Text size="sm">Системээс гарах</Text>
        </Group>
      </UnstyledButton>
    </Navbar>
  );
}

export default NavigationBar;
