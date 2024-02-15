import {
  Button,
  Flex,
  Grid,
  Group,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconArrowBack, IconCheck } from '@tabler/icons';
import React, { useMemo } from 'react';

function CategoryEditor({ initialData, type, categories, collapse, onSubmit }) {
  const multiSelectReadOnlyStyle = useMemo(
    () => ({
      input: {
        border: 'none',
        backgroundColor: 'transparent',
        ':hover': {
          cursor: 'default',
        },
      },
      searchInput: {
        ':hover': {
          cursor: 'default',
        },
      },
    }),
    []
  );
  const form = useForm({
    initialValues: {
      id: initialData?.id,
      name: initialData?.name,
      active: initialData?.active,
      ...(type === 'parent'
        ? { main_cat_id: [initialData.main_cat_id?.toString()] }
        : type === 'child'
        ? {
            parent_id: [initialData.parent_id?.toString()],
            main_cat_id: [initialData.main_cat_id?.toString()],
          }
        : {}),
      //   ...(type === 'main'
      //     ? { main_id: values.id }
      //     : type === 'parent'
      //     ? { parent_id: values.id, main_cat_id: values.main_cat_id }
      //     : {
      //         child_id: values.id,
      //         parent_id: values.parent_id,
      //         main_cat_id: values.main_cat_id,
      //       }),

      //   parent_cat_id: categories.parentCategories
      //     .filter((e) => e.id === initialData?.id)
      //     .map((e) => e.id.toString()),
    },
    validate: {
      name: isNotEmpty('Нэр оруулна уу'),
    },
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values, e) => {
        await onSubmit(values);
        collapse();
        // form.setValues(initialData);
        // console.log('a');
      })}
    >
      <Group px="lg" py="xs" position="apart" align="flex-end">
        <Flex gap="xl">
          <Grid>
            <Grid.Col span={8}>
              <TextInput label="Ангиллын нэр" size="xs" {...form.getInputProps('name')} />
            </Grid.Col>
            {type === 'main' && (
              <Grid.Col span={8}>
                <MultiSelect
                  label="Дэд ангиллууд"
                  size="xs"
                  placeholder="Байхгүй"
                  data={categories?.parentCategories?.map((e) => {
                    return { value: e.id.toString(), label: e.name };
                  })}
                  {...form.getInputProps('parent_id')}
                  readOnly
                />
              </Grid.Col>
            )}
            {type === 'child' && (
              <>
                <Grid.Col span={8}>
                  <MultiSelect
                    label="Ерөнхий ангиллууд"
                    size="xs"
                    placeholder="Байхгүй"
                    data={categories?.mainCategories?.map((e) => {
                      return { value: e.id.toString(), label: e.name };
                    })}
                    {...form.getInputProps('main_cat_id')}
                    readOnly
                  />
                </Grid.Col>
                <Grid.Col span={8}>
                  <MultiSelect
                    label="Дэд ангиллууд"
                    size="xs"
                    placeholder="Байхгүй"
                    data={categories?.parentCategories?.map((e) => {
                      return { value: e.id.toString(), label: e.name };
                    })}
                    {...form.getInputProps('parent_id')}
                    readOnly
                  />
                </Grid.Col>
              </>
            )}
            <Grid.Col span={6}>
              <Select
                size="xs"
                label="Идэвхитэй эсэх"
                data={[
                  { value: true, label: 'Идэвхитэй' },
                  { value: false, label: 'Идэвхигүй' },
                ]}
                {...form.getInputProps('active')}
              />
            </Grid.Col>
          </Grid>
        </Flex>
        <Group>
          <Button
            variant="default"
            size="xs"
            leftIcon={<IconArrowBack size={18} />}
            onClick={collapse}
          >
            Цуцлах
          </Button>
          <Button size="xs" leftIcon={<IconCheck size={18} />} type="submit">
            Шинэчлэх
          </Button>
        </Group>
      </Group>
    </form>
  );
}

export default CategoryEditor;
