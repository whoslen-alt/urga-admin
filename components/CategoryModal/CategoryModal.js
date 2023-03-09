import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';
import { useMemo, useState } from 'react';
import { useForm } from '@mantine/form';

export function CategoryModal({ opened, close, type }) {
  const form = useForm({
    initialValues: {
      name: '',
    },

    validate: {
      name: (value) => (value.length > 0 ? null : 'Нэр оруулна уу'),
    },
  });
  const categoryTypes = useMemo(
    () => ({
      general: 'Ерөнхий',
      parent: 'Дэд',
      product: 'Барааны',
    }),
    []
  );
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (fields) => {
    setLoading(true);
    if (type === 'general') {
      fetch(`${process.env.NEXT_PUBLIC_API}/category/main`, {
        method: 'POST',
        body: {
          name: fields.name,
        },
      })
        .then((value) => {
          console.log(value.json());
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={<Text>{categoryTypes[type]} ангилал үүсгэх</Text>}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Flex direction="column">
          <TextInput
            mt="sm"
            // label="Ангиллын нэр"
            placeholder="Ангиллын нэр"
            min={0}
            {...form.getInputProps('name')}
          />
        </Flex>
        <Group position="right" mt="xl">
          <Button variant="subtle" radius="xl" onClick={close}>
            Цуцлах
          </Button>
          <Button type="submit" radius="xl" loading={loading}>
            Үүсгэх
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
