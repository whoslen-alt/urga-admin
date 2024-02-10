import {
  IconList,
  IconPackage,
  IconBrowser,
  IconCheckupList,
  IconUsers,
  IconUserMinus,
  IconUnlink,
  IconReceiptRefund,
  IconClipboardText,
  IconAdjustments,
} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { useRouter } from 'next/router';

function MainLink({ icon, label, link }) {
  const router = useRouter();
  const exactPath = link.split('/')[1];

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
        color: router.asPath.includes(exactPath)
          ? theme.colors.blue[6]
          : theme.colorScheme === 'dark'
          ? theme.colors.dark[0]
          : theme.black,
        backgroundColor: router.asPath.includes(exactPath) ? theme.colors.blue[0] : undefined,
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon variant={router.asPath.includes(exactPath) ? 'light' : 'default'}>
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  { icon: <IconList size={16} />, label: 'Ангиллууд', link: '/category/main' },
  { icon: <IconPackage size={16} />, label: 'Бараанууд', link: '/product' },
  { icon: <IconCheckupList size={16} />, label: 'Захиалгууд', link: '/order' },
  { icon: <IconUsers size={16} />, label: 'Админ хэрэглэгчид', link: '/user' },
  { icon: <IconUserMinus size={16} />, label: 'Эрхийн тохиргоо', link: '/role' },
  { icon: <IconBrowser size={16} />, label: 'Веб сайт тохиргоо', link: '/webconfig' },
  { icon: <IconUnlink size={16} />, label: 'Салбарууд', link: '/branch' },
  { icon: <IconReceiptRefund size={16} />, label: 'Буцаалт', link: '/refund' },
  { icon: <IconClipboardText size={16} />, label: 'Санал хүсэлт', link: '/feedback' },
  { icon: <IconAdjustments size={16} />, label: 'Тохируулга', link: '/misc' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return links;
}
