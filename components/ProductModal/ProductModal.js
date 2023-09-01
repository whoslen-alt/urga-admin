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
  SimpleGrid,
  Image,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconArrowBack, IconX } from '@tabler/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ProductModal({ initialData, isOpen, close, categories, onSubmit, loading, userToken }) {
  const [isFileUploading, setIsFileUploading] = useState(false);
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
      images: initialData?.product_image?.images || [],
      active: initialData?.active,
      deleted_images: [],
    },
    validate: {
      name: (value) => (value ? null : 'Нэр оруулна уу'),
      images: (value) => (value.length > 3 ? '3- аас их зураг оруулах боломжгүй' : null),
    },
  });
  useEffect(() => {
    if (initialData) {
      form.setFieldValue('images', initialData?.product_image?.images);
    }
  }, [initialData]);
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const handleImageDrop = async (acceptedFiles) => {
    const formData = new FormData();
    if (acceptedFiles) {
      setIsFileUploading(true);
      for (const file of acceptedFiles) {
        formData.append('img', file, file.name);
        axios
          .post(`${process.env.NEXT_PUBLIC_API}/admin/upload`, formData, config)
          .then((value) => {
            if (value.status === 200) {
              const imgUrl = value.data.data;
              form.insertListItem('images', imgUrl);
            }
            return setIsFileUploading(false);
          })
          .catch((err) => setIsFileUploading(false));
        formData.delete('img');
      }
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
        onSubmit={form.onSubmit(async (values) => {
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
            {/* <Grid.Col span={12}>
              <FileInput
                size="xs"
                onChange={(value, e) => {
                  handleUpload(value);
                  
                }} 
                label="Барааны зураг оруулах"
                placeholder="3 аас дээшгүй зураг оруулна уу!"
                multiple
              />
            </Grid.Col> */}
            <Grid.Col span={12}>
              <Text size="xs" weight="bold">
                Барааны зураг оруулах
              </Text>
              <Dropzone
                disabled={form.values.images?.length === 3}
                mt="xs"
                multiple
                maxFiles={3}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
                onDrop={handleImageDrop}
                loading={isFileUploading}
              >
                <Text align="center" size="sm">
                  3- аас дээшгүй зураг оруулна уу
                </Text>
              </Dropzone>
              <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt="xl">
                {form.values.images &&
                  form.values.images?.map((imageUrl, index) => (
                    <Stack key={imageUrl + index} spacing={0} pos="relative">
                      <Image src={imageUrl} withPlaceholder />
                      <ActionIcon
                        variant="filled"
                        radius="xl"
                        color="red"
                        size="xs"
                        pos="absolute"
                        top={-10}
                        right={-10}
                        onClick={() => {
                          form.removeListItem('images', index);
                          form.insertListItem('deleted_images', imageUrl);
                        }}
                      >
                        <IconX size="0.8rem" />
                      </ActionIcon>
                    </Stack>
                  ))}
              </SimpleGrid>
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
