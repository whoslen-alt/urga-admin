import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { useMemo } from 'react';
import { isNotEmpty, useForm } from '@mantine/form';

export function CategoryModal({ opened, close, type, creating, onSubmit, categories }) {
  const form = useForm({
    initialValues: {
      name: '',
      main_cat_id: '',
      parent_cat_id: '',
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Нэр оруулна уу'),
      main_cat_id: type === 'parent' || type === 'child' ? isNotEmpty('Ангилал сонгоно уу') : null,
      parent_cat_id: type === 'child' ? isNotEmpty('Ангилал сонгоно уу') : null,
    },
  });
  const categoryTypes = useMemo(
    () => ({
      main: 'Ерөнхий',
      parent: 'Дэд',
      child: 'Барааны',
    }),
    []
  );
  const handleSubmit = async (fields) => {
    await onSubmit(fields, type);
    form.reset();
  };
  const handleClose = () => {
    form.reset();
    close();
  };
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={<Text>{categoryTypes[type]} ангилал үүсгэх</Text>}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack>
          <TextInput
            mt="sm"
            label="Ангиллын нэр"
            placeholder="Ангиллын нэр"
            size="xs"
            min={0}
            {...form.getInputProps('name')}
          />
          {(type === 'parent' || type === 'child') && (
            <Select
              label="Ерөнхий ангилал"
              placeholder="Нэгийг сонгоно уу"
              dropdownPosition="bottom"
              withinPortal
              data={categories.mainCategories.map((e) => {
                return { label: e.name, value: e.id.toString() };
              })}
              size="xs"
              {...form.getInputProps('main_cat_id')}
            />
          )}
          {type === 'child' && (
            <Select
              label="Дэд ангилал"
              placeholder="Нэгийг сонгоно уу"
              dropdownPosition="bottom"
              withinPortal
              data={categories.parentCategories.map((e) => {
                return { label: e.name, value: e.id.toString() };
              })}
              size="xs"
              {...form.getInputProps('parent_cat_id')}
            />
          )}
        </Stack>
        <Group position="right" mt="xl">
          <Button variant="subtle" radius="xl" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button type="submit" radius="xl" loading={creating}>
            Үүсгэх
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
