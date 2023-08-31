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
  FileInput,
  Text,
  LoadingOverlay,
  Select,
} from '@mantine/core';

import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconArrowBack, IconCheck } from '@tabler/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ProductModal({ initialData, isOpen, close, categories, onSubmit, loading, userToken }) {
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
      active: initialData?.active,
      product_image: initialData?.product_image || [],
    },
    validate: {
      name: (value) => (value ? null : 'Нэр оруулна уу'),
    },
  });

  const handleUpload = async (files) => {
    const formData = new FormData();

    if (files) {
      for (const file of files) {
        formData.append('img', file, `product/${file.name}`);
      }
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/admin/upload`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (res.status === 200) {
        form.setFieldValue('product_image', [res.data.data]); // Update the field value here

        console.log(res.data.data);
      } else {
        showNotification({
          title: title + ' амжилтгүй',
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (err) {
      console.error('Зураг оруулах явцад алдаа гарлаа. Алдаа: ' + err);
    }
  };

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
          close();
        })}
      >
        <Group position="center">
          <Grid>
            <Grid.Col span={9} xs={9}>
              <TextInput label="Барааны нэр" {...form.getInputProps('name')} size="xs" />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
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
              <FileInput
                size="xs"
                onChange={(value, e) => {
                  handleUpload(value);
                  // if (form.getInputProps(`product_image`).onChange)
                  //   form.getInputProps(`product_image`).onChange(value);
                }}
                // {...form.getInputProps('product_image')}
                label="Барааны зураг оруулах"
                placeholder="3 аас дээшгүй зураг оруулна уу!"
                multiple
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
