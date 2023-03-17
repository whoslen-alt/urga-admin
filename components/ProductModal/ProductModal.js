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

import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBack, IconCheck } from '@tabler/icons';
import { useEffect } from 'react';
function ProductModal({ initialData, isOpen, close, categories, onSubmit, loading }) {
  const form = useForm({
    initialValues: {
      name: initialData?.name,
      main_cat_id: initialData?.main_cat_id?.map((e) => e.toString()),
      parent_cat_id: initialData?.parent_cat_id?.map((e) => e.toString()),
      child_cat_id: initialData?.child_cat_id?.map((e) => e.toString()),
      note: initialData?.note,
      description: initialData?.description,
      instruction: initialData?.instruction,
      detailed_description: initialData?.detailed_description,
      packaging: initialData?.packaging,
      instock: initialData?.instock,
      price: initialData?.price,
      promo_price: initialData?.promo_price,
      wholesale_price: initialData?.wholesale_price,
      wholesale_qty: initialData?.wholesale_qty,
      images: '',
    },
    validate: {
      name: (value) => (value ? null : 'Нэр оруулна уу'),
    },
  });
  useEffect(() => {
    form.setValues(initialData);
  }, [initialData]);

  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        form.setValues(initialData);
        close();
      }}
      title={initialData?.create ? 'Бараа үүсгэх' : 'Барааны мэдээлэл засварлах'}
      size="lg"
      closeOnClickOutside={false}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form
        onSubmit={form.onSubmit(async (values, e) => {
          const a = await onSubmit(values);
          form.setValues(initialData);
          console.log('a');
          close();
        })}
      >
        <Group position="center">
          <Grid>
            <Grid.Col span={12} xs={12}>
              <TextInput label="Барааны нэр" {...form.getInputProps('name')} size="xs" />
            </Grid.Col>
            <Grid.Col span={4} xs={4}>
              <MultiSelect
                data={categories.mainCategories.map((e) => {
                  return { label: e.name, value: e.id };
                })}
                label="Ерөнхий ангилал"
                size="xs"
                {...form.getInputProps('main_cat_id')}
              />
            </Grid.Col>
            <Grid.Col span={4} xs={4}>
              <MultiSelect
                data={categories.parentCategories.map((e) => {
                  return { label: e.name, value: e.id };
                })}
                label="Дэд ангилал"
                size="xs"
                {...form.getInputProps('parent_cat_id')}
              />
            </Grid.Col>
            <Grid.Col span={4} xs={4}>
              <MultiSelect
                data={categories.childCategories.map((e) => {
                  return { label: e.name, value: e.id };
                })}
                label="Барааны ангилал"
                size="xs"
                {...form.getInputProps('child_cat_id')}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Үлдэгдэл"
                {...form.getInputProps('instock')}
                size="xs"
                rightSection={<Text size="xs">{initialData?.unit}</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Савлагаа"
                {...form.getInputProps('packaging')}
                size="xs"
                rightSection={<Text size="xs">{initialData?.unit}</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Нэгж үнэ"
                {...form.getInputProps('price')}
                size="xs"
                rightSection={<Text size="xs">₮</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Хямдралтай үнэ"
                {...form.getInputProps('promo_price')}
                size="xs"
                rightSection={<Text size="xs">₮</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Бөөний тоо ширхэг"
                {...form.getInputProps('wholesale_qty')}
                size="xs"
                rightSection={<Text size="xs">{initialData?.unit}</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Бөөний үнэ"
                {...form.getInputProps('wholesale_price')}
                size="xs"
                rightSection={<Text size="xs">₮</Text>}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Тэмдэглэл"
                placeholder="Барааны талаарх тэмдэглэлээ энд оруулаарай..."
                autosize
                minRows={2}
                maxRows={4}
                size="xs"
                {...form.getInputProps('note')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Тайлбар"
                placeholder="Барааны талаарх богино тайлбараа энд оруулаарай..."
                autosize
                minRows={2}
                maxRows={4}
                size="xs"
                {...form.getInputProps('description')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Ашиглах заавар"
                placeholder="Барааг ашиглах заавраа энд оруулаарай..."
                minRows={2}
                maxRows={4}
                size="xs"
                {...form.getInputProps('instruction')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Дэлгэрэнгүй тайлбар"
                placeholder="Барааны дэлгэрэнгүй тайлбараа энд оруулаарай..."
                minRows={2}
                maxRows={4}
                size="xs"
                {...form.getInputProps('detailed_description')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Group position="right">
                <Button variant="subtle" size="xs" onClick={close}>
                  Цуцлах
                </Button>
                <Button size="xs" type="submit">
                  {initialData?.create ? 'Үүсгэх' : 'Хадгалах'}
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Group>
      </form>
    </Modal>
  );
}

export default ProductModal;