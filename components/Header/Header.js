import Link from 'next/link';
import {
  Header as MantineHeader,
  Group,
  MediaQuery,
  Burger,
  Text,
  useMantineTheme,
  Box,
  Flex,
} from '@mantine/core';
import { useState } from 'react';
import Image from 'next/image';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
function Header({ setOpen, isOpen }) {
  const theme = useMantineTheme();
  return (
    <MantineHeader height={{ base: 50, md: 70 }} p="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={isOpen}
            onClick={() => setOpen((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Flex align="center" gap={30}>
          <Box sx={{ marginLeft: 10 }}>
            <Link href="/">
              <Image src={'/logo.png'} height={40} width={40} alt="logo" />
            </Link>
          </Box>
          <Text weight="lighter">Таримал Ургамал ХХК</Text>
        </Flex>
        <ColorSchemeToggle />
      </div>
    </MantineHeader>
  );
}

export default Header;
