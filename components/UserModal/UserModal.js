import { useEffect } from 'react';
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
  Select,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';

function UserModal({ initialData, isOpen, close, onSubmit, loading, roles }) {
  const form = useForm({
    initialValues: {
      username: initialData?.username,
      email: initialData?.email,
      password: initialData?.password,
      active: initialData?.active,
      roleid: initialData?.emp_role?.id,
    },
    validate: {
      username: isNotEmpty('Нэр оруулна уу'),
      email: isNotEmpty('И-мейл оруулна уу'),
      password: initialData?.create ? isNotEmpty('Нууц үг оруулна уу') : null,
    },
  });

  useEffect(() => {
    form.setValues(initialData);
    return () => {
      form.reset();
    };
  }, [initialData]);

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        form.reset();
        close();
      }}
      title={initialData?.create ? 'Админ хэрэглэгч үүсгэх' : 'Мэдээлэл засварлах'}
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
          {/* <Grid.Col span={12} xs={12}>
            <Select
              label="Идэвхитэй эсэх"
              data={[
                { label: 'Идэвхитэй', value: true },
                { label: 'Идэвхигүй', value: false },
              ]}
              {...form.getInputProps('active')}
              size="xs"
            />
          </Grid.Col> */}
          <Grid.Col span={12} xs={12}>
            <Select
              searchable
              label="Эрх"
              data={roles?.map((role) => ({ label: role?.name, value: role.id }))}
              {...form.getInputProps('roleid')}
              size="xs"
            />
          </Grid.Col>
          {initialData?.create && (
            <Grid.Col span={12} xs={12}>
              <TextInput label="Нууц үг" {...form.getInputProps('password')} size="xs" />
            </Grid.Col>
          )}
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
              <Button type="submit"> {initialData?.create ? 'Үүсгэх' : 'Хадгалах'}</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
}

export default UserModal;
