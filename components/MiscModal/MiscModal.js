import { useEffect } from 'react';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

function MiscModal({ isOpen, close, loading, onSubmit }) {
  const form = useForm({
    initialValues: {
      key: '',
      value: '',
    },

    validate: {
      key: isNotEmpty('Бичих шаардлагатай'),
      value: isNotEmpty('Бичих шаардлагатай'),
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Modal title="Тохиргооны тогтмол үүсгэх" opened={isOpen} onClose={close} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="xs">
          <TextInput label="Нэр" placeholder="Нэр" size="xs" {...form.getInputProps('key')} />
          <TextInput label="Утга" placeholder="Утга" size="xs" {...form.getInputProps('value')} />
        </Stack>
        <Group position="right" mt="xl">
          <Button variant="subtle" radius="xl" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button type="submit" radius="xl" loading={loading}>
            Нэмэх
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default MiscModal;
