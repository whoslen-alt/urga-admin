import {
  Modal,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  MultiSelect,
  Textarea,
  TextInput,
  Group,
  Text,
  LoadingOverlay,
} from '@mantine/core';

import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBack, IconCheck } from '@tabler/icons';
import { useEffect } from 'react';
function UserModal({ isOpen, close, onSubmit, loading }) {
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validate: {
      username: isNotEmpty('Нэр оруулна уу'),
      email: isNotEmpty('И-мейл оруулна уу'),
      password: isNotEmpty('Нууц үг оруулна уу'),
    },
  });

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        form.reset();
        close();
      }}
      title="Админ хэрэглэгч үүсгэх"
      closeOnClickOutside={false}
      centered
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          await onSubmit(values);
          close();
        })}
      >
        <Grid>
          <Grid.Col span={12} xs={12}>
            <TextInput label="Хэрэглэгчийн нэр" {...form.getInputProps('username')} size="xs" />
          </Grid.Col>
          <Grid.Col span={12} xs={12}>
            <TextInput label="И-мейл" {...form.getInputProps('email')} size="xs" />
          </Grid.Col>
          <Grid.Col span={12} xs={12}>
            <TextInput label="Нууц үг" {...form.getInputProps('password')} size="xs" />
          </Grid.Col>
          <Grid.Col span={12} xs={12}>
            <Group position="right">
              <Button
                variant="default"
                onClick={() => {
                  form.reset();
                  close();
                }}
              >
                Цуцлах
              </Button>
              <Button type="submit">Үүсгэх</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
}

export default UserModal;
