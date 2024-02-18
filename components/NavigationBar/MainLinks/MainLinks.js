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
  IconFileInvoice,
  IconPackages,
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
        backgroundColor: router.asPath.includes(exactPath)
          ? theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.blue[0]
          : undefined,
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
  { icon: <IconList stroke={1} size={16} />, label: 'Ангиллууд', link: '/category/main' },
  { icon: <IconPackage stroke={1} size={16} />, label: 'Бараанууд', link: '/product' },
  { icon: <IconPackages stroke={1} size={16} />, label: 'Special deals', link: '/deal' },
  { icon: <IconCheckupList stroke={1} size={16} />, label: 'Захиалгууд', link: '/order' },
  { icon: <IconFileInvoice stroke={1} size={16} />, label: 'Нэхэмжлэл', link: '/invoice' },
  { icon: <IconReceiptRefund stroke={1} size={16} />, label: 'Буцаалт', link: '/refund' },
  { icon: <IconUsers stroke={1} size={16} />, label: 'Админ хэрэглэгчид', link: '/user' },
  { icon: <IconUserMinus stroke={1} size={16} />, label: 'Эрхийн тохиргоо', link: '/role' },
  { icon: <IconBrowser stroke={1} size={16} />, label: 'Веб сайт тохиргоо', link: '/webconfig' },
  { icon: <IconUnlink stroke={1} size={16} />, label: 'Салбарууд', link: '/branch' },
  { icon: <IconClipboardText stroke={1} size={16} />, label: 'Санал хүсэлт', link: '/feedback' },
  { icon: <IconAdjustments stroke={1} size={16} />, label: 'Тохируулга', link: '/misc' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return links;
}
