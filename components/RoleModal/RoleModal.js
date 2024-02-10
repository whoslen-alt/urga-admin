import {
  Modal,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Textarea,
  TextInput,
  Group,
  Text,
  LoadingOverlay,
  MultiSelect,
  Select,
} from '@mantine/core';

import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBack, IconCheck } from '@tabler/icons';
import { useEffect } from 'react';

const PERMISSIONS = [
  { value: 'order', label: 'order' },
  { value: 'config', label: 'config' },
  { value: 'product', label: 'product' },
  { value: 'feedback', label: 'feedback' },
  { value: 'contact', label: 'contact' },
  { value: 'mail', label: 'mail' },
  { value: 'masssms', label: 'masssms' },
  { value: 'employee', label: 'employee' },
  { value: 'deal', label: 'deal' },
  { value: 'about', label: 'about' },
  { value: 'branch', label: 'branch' },
  { value: 'content', label: 'content' },
  { value: 'sync', label: 'sync' },
  { value: 'misc', label: 'misc' },
  { value: 'refund', label: 'refund' },
];

function RoleModal({ initialData, isOpen, close, onSubmit, loading }) {
  const form = useForm({
    initialValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      permissions: initialData?.permissions || [],
      active: initialData?.active || false,
    },
    validate: {
      name: isNotEmpty('Нэр оруулна уу'),
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
      title={initialData?.create ? 'Эрх үүсгэх' : 'Эрх засварлах'}
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
            <TextInput label="Нэр" {...form.getInputProps('name')} size="xs" />
          </Grid.Col>
          <Grid.Col span={12} xs={12}>
            <MultiSelect
              withinPortal={true}
              label="Эрхүүд"
              data={PERMISSIONS}
              {...form.getInputProps('permissions')}
              size="xs"
              placeholder="Эрх сонгоно уу"
            />
          </Grid.Col>
          <Grid.Col span={12} xs={12}>
            <Select
              label="Идэвхитэй эсэх"
              data={[
                { label: 'Идэвхитэй', value: true },
                { label: 'Идэвхигүй', value: false },
              ]}
              {...form.getInputProps('active')}
              size="xs"
            />
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
              <Button type="submit"> {initialData?.create ? 'Үүсгэх' : 'Хадгалах'}</Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
}

export default RoleModal;
