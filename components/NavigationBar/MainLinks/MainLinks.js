import {
  IconList,
  IconUser,
  IconPackage,
  IconGlobe,
  IconBrowser,
  IconCheckupList,
  IconChecklist,
  IconUsers,
} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { useRouter } from 'next/router';

function MainLink({ icon, label, link }) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push(link);
  };
  return (
    <UnstyledButton
      onClick={handleClick}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon variant="default">{icon}</ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  { icon: <IconList size={16} />, label: 'Ангилалууд', link: '/category' },
  { icon: <IconUsers size={16} />, label: 'Админ хэрэглэгчид', link: '/user' },
  { icon: <IconPackage size={16} />, label: 'Бараанууд', link: '/product' },
  { icon: <IconCheckupList size={16} />, label: 'Захиалгууд', link: '/order' },
  { icon: <IconBrowser size={16} />, label: 'Веб сайт тохиргоо', link: '/webconfig' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
