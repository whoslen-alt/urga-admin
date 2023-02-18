import Link from 'next/link';
import { Flex, Navbar, NavLink, Text } from '@mantine/core';
import { useState } from 'react';

import Image from 'next/image';
import { MainLinks } from './MainLinks/MainLinks';
function NavigationBar({ isOpen }) {
  return (
    <Navbar p="sm" hiddenBreakpoint="sm" hidden={!isOpen} width={{ sm: 200, lg: 250 }}>
      <Navbar.Section grow mt="sm">
        <MainLinks />
      </Navbar.Section>
    </Navbar>
  );
}

export default NavigationBar;
