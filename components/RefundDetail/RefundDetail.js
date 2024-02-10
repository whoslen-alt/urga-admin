import { Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
function RefundDetail({ detail }) {
  return (
    <Group px={12} py="xs" spacing="lg" align="flex-start">
      <Stack p="xs" spacing="sm" align="flex-start">
        <Group spacing={6}>
          <Text weight="bold">Банк:</Text>
          <Text>{detail?.bank_type ? detail?.bank_type : 'Оруулаагүй байна'}</Text>
        </Group>
        <Group spacing={6}>
          <Text weight="bold">Банкны дугаар:</Text>
          <Text>
            {detail?.bank_account_number ? detail?.bank_account_number : 'Оруулаагүй байна'}
          </Text>
        </Group>
      </Stack>
      <Stack p="xs" spacing="sm" align="flex-start">
        {detail?.respondent && (
          <Group spacing={6}>
            <Text weight="bold">Хариу өгсөн ажилтан:</Text>
            <Text>{detail?.respondent?.username}</Text>
          </Group>
        )}
        {detail?.respondedAt && (
          <Group spacing={6}>
            <Text weight="bold">Хариу өгсөн огноо:</Text>
            <Text>{dayjs(detail?.respondedAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
          </Group>
        )}
      </Stack>
    </Group>
  );
}

export default RefundDetail;
