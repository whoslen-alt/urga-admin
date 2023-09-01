import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  SimpleGrid,
  ActionIcon,
  Image,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconX } from '@tabler/icons';

import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

export function CategoryModal({
  opened,
  close,
  type,
  creating,
  onSubmit,
  categories,
  isFileUploading,
  handleImageDrop,
}) {
  const form = useForm({
    initialValues: {
      name: '',
      main_cat_id: '',
      parent_cat_id: '',
      icon: null,
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
          {type === 'parent' && (
            <div>
              <Text size="xs" weight="bold">
                Icon зураг оруулах
              </Text>
              <Dropzone
                mt="xs"
                maxFiles={1}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
                onDrop={(acceptedFiles) => {
                  handleImageDrop(acceptedFiles, (imgUrl) => form.setFieldValue('icon', imgUrl));
                }}
                loading={isFileUploading}
              >
                <Text align="center" size="sm">
                  Та файлаа энд хуулна уу
                </Text>
              </Dropzone>
              <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt="xl">
                {form.getInputProps('icon').value && (
                  <Stack spacing={0} pos="relative">
                    <Image src={form.getInputProps('icon').value} withPlaceholder />
                    <ActionIcon
                      variant="filled"
                      radius="xl"
                      color="red"
                      size="xs"
                      pos="absolute"
                      top={-10}
                      right={-10}
                      onClick={() => form.setFieldValue('icon', null)}
                    >
                      <IconX size="0.8rem" />
                    </ActionIcon>
                  </Stack>
                )}
              </SimpleGrid>
            </div>
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
