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

function ProductModal({ initialData, isOpen, close, onSubmit, loading, userToken }) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const form = useForm({
    initialValues: {
      name: initialData?.name,
      // main_cat_id: initialData?.main_cat_id?.map((e) => e.toString()),
      // parent_cat_id: initialData?.parent_cat_id?.map((e) => e.toString()),
      // child_cat_id: initialData?.child_cat_id?.map((e) => e.toString()),
      note: initialData?.note,
      description: initialData?.description,
      instruction: initialData?.instruction,
      detailed_description: initialData?.detailed_description,
      qtyPerPackage: initialData?.qtyPerPackage,
      balance: initialData?.balance,
      listPrice: initialData?.listPrice,
      // promo_price: initialData?.promo_price,
      wholePrice: initialData?.wholePrice,
      wholeQty: initialData?.wholeQty,
      additionalImage: [],
      // active: initialData?.active,
      deletedImages: [],
    },
    validate: {
      name: (value) => (value ? null : 'Нэр оруулна уу'),
      balance: (value) => (value ? (isNaN(value) ? 'Тоо оруулна уу' : null) : null),
      qtyPerPackage: (value) => (value ? (isNaN(value) ? 'Тоо оруулна уу' : null) : null),
      listPrice: (value) => (value ? (isNaN(value) ? 'Тоо оруулна уу' : null) : null),
      // promo_price: (value) => (value ? (isNaN(value) ? 'Тоо оруулна уу' : null) : null),
      wholePrice: (value) => (value ? (isNaN(value) ? 'Тоо оруулна уу' : null) : null),
      wholeQty: (value) => (value ? (isNaN(value) ? 'Тоо оруулна уу' : null) : null),
    },
  });
  useEffect(() => {
    if (initialData) {
      form.setFieldValue('additionalImage', initialData?.additionalImage || []);
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
        formData.append('productid', initialData?.id);
        axios
          .post(`${process.env.NEXT_PUBLIC_API}/admin/product/upload`, formData, config)
          .then((value) => {
            if (value.status === 200) {
              const imgUrl = value.data.url;
              form.insertListItem('additionalImage', { url: imgUrl });
            }
            return setIsFileUploading(false);
          })
          .catch((err) => setIsFileUploading(false));
        formData.delete('img');
        formData.delete('productid');
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
            {/* <Grid.Col span={3} xs={3}>
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
            {/* <Grid.Col span={4} xs={4}>
              <MultiSelect
                data={
                  categories?.mainCategories?.map((e) => {
                    return { label: e.name, value: e.id };
                  }) || []
                }
                label="Ерөнхий ангилал"
                size="xs"
                {...form.getInputProps('main_cat_id')}
              />
            </Grid.Col>
            <Grid.Col span={4} xs={4}>
              <MultiSelect
                data={
                  categories?.parentCategories?.map((e) => {
                    return { label: e.name, value: e.id };
                  }) || []
                }
                label="Дэд ангилал"
                size="xs"
                {...form.getInputProps('parent_cat_id')}
              />
            </Grid.Col>
            <Grid.Col span={4} xs={4}>
              <MultiSelect
                data={
                  categories?.childCategories?.map((e) => {
                    return { label: e.name, value: e.id };
                  }) || []
                }
                label="Барааны ангилал"
                size="xs"
                {...form.getInputProps('child_cat_id')}
              />
            </Grid.Col> */}
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Үлдэгдэл"
                {...form.getInputProps('balance')}
                size="xs"
                rightSection={<Text size="xs">{initialData?.unit}</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Савлагаа"
                {...form.getInputProps('qtyPerPackage')}
                size="xs"
                rightSection={<Text size="xs">{initialData?.unit}</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Нэгж үнэ"
                {...form.getInputProps('listPrice')}
                size="xs"
                rightSection={<Text size="xs">₮</Text>}
              />
            </Grid.Col>
            {/* <Grid.Col span={3} xs={3}>
              <TextInput
                label="Хямдралтай үнэ"
                {...form.getInputProps('promo_price')}
                size="xs"
                rightSection={<Text size="xs">₮</Text>}
              />
            </Grid.Col> */}
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Бөөний тоо ширхэг"
                {...form.getInputProps('wholeQty')}
                size="xs"
                rightSection={<Text size="xs">{initialData?.unit}</Text>}
              />
            </Grid.Col>
            <Grid.Col span={3} xs={3}>
              <TextInput
                label="Бөөний үнэ"
                {...form.getInputProps('wholePrice')}
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
              <Text size="xs" weight="bold">
                Барааны зураг оруулах
              </Text>
              <Dropzone
                mt="xs"
                multiple
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
                onDrop={handleImageDrop}
                loading={isFileUploading}
              >
                <Text align="center" size="sm">
                  3- аас дээшгүй зураг оруулна уу
                </Text>
              </Dropzone>
              <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt="xl">
                {form.values.additionalImage &&
                  form.values.additionalImage?.map((image, index) => (
                    <Stack key={image?.key + index} spacing={0} pos="relative">
                      <Image src={image?.url} withPlaceholder />
                      <ActionIcon
                        variant="filled"
                        radius="xl"
                        color="red"
                        size="xs"
                        pos="absolute"
                        top={-10}
                        right={-10}
                        onClick={() => {
                          form.removeListItem('additionalImage', index);
                          form.insertListItem('deletedImages', image?.key);
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
