import { forwardRef, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Image,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconPackage, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { useProducts } from '../../hooks/useProducts';
import { useDebouncedValue } from '@mantine/hooks';
import dayjs from 'dayjs';

function DealModal({ initialData, isOpen, close, loading, onSubmit, userToken }) {
  const [file, setFile] = useState(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [productQuery, setProductQuery] = useState('');
  const [debounced] = useDebouncedValue(productQuery, 500);

  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    { query: '', offset: 0, limit: 100000 },
    userToken
  );

  const prodMenuData = useMemo(() => {
    return productsData?.result?.map((prod) => ({
      value: prod?.id,
      label: prod?.name,
      image: prod?.additionalImage?.[0]?.url,
    }));
  }, [productsData]);

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const form = useForm({
    initialValues: {
      name: initialData?.name,
      description: initialData?.description,
      start_date: null,
      end_date: null,
      productids: initialData?.productids || [],
      icon: initialData?.icon,
    },

    validate: {
      //   start_date: isNotEmpty('Бичих шаардлагатай'),
      //   end_date: isNotEmpty('Бичих шаардлагатай'),
    },
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.setValues({
        ...initialData,
        productids: initialData?.special_deals,
        start_date: initialData?.start_date ? new Date(initialData?.start_date) : null,
        end_date: initialData?.end_date ? new Date(initialData?.end_date) : null,
      });
      setFile(initialData?.icon);
    }

    return () => {
      form.reset();
    };
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      form.reset();
    }
  }, [isOpen]);

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  const previews = (
    <Stack spacing={0} pos="relative" key={file}>
      <Image src={file} withPlaceholder imageProps={{ onLoad: () => file }} />
      <ActionIcon
        variant="filled"
        radius="xl"
        color="red"
        size="xs"
        pos="absolute"
        top={-10}
        right={-10}
        onClick={() => {
          form.setFieldValue('icon', null);
          setFile(null);
        }}
      >
        <IconX size="0.8rem" />
      </ActionIcon>
    </Stack>
  );

  const SelectItem = forwardRef(({ image, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap spacing="xs">
        <Avatar size="sm" src={image} placeholder="as">
          <IconPackage stroke={1} />
        </Avatar>
        <Text size="xs">{label}</Text>
      </Group>
    </div>
  ));

  const handleImageDrop = async (acceptedFiles) => {
    const formData = new FormData();
    if (acceptedFiles) {
      setIsFileUploading(true);
      for (const file of acceptedFiles) {
        formData.append('img', file, file.name);
        formData.append('folder', 'deal');
        axios
          .post(`${process.env.NEXT_PUBLIC_API}/admin/product/upload`, formData, config)
          .then((value) => {
            if (value.status === 200) {
              const imgUrl = value.data.url;
              form.setFieldValue('icon', imgUrl);
              setFile(imgUrl);
            }

            return setIsFileUploading(false);
          })
          .catch((err) => setIsFileUploading(false));
        formData.delete('img');
        formData.delete('icon');
      }
    }
  };

  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape
      title={initialData?.create ? 'Deal үүсгэх' : 'Deal засварлах'}
      opened={isOpen}
      onClose={() => {
        form.setValues({
          ...initialData,
          productids: initialData?.special_deals,
          start_date: initialData?.start_date ? new Date(initialData?.start_date) : null,
          end_date: initialData?.end_date ? new Date(initialData?.end_date) : null,
        });
        setFile(initialData?.icon);
        close();
      }}
      centered
      withinPortal
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="xs">
          <TextInput label="Нэр" placeholder="Нэр" size="xs" {...form.getInputProps('name')} />
          <Textarea
            label="Тайлбар"
            placeholder="Тайлбар"
            size="xs"
            {...form.getInputProps('description')}
          />
          {!isProductsLoading && (
            <MultiSelect
              label="Бараанууд"
              placeholder="Бараанууд сонгоно уу"
              itemComponent={SelectItem}
              withinPortal
              data={prodMenuData}
              //   onSearchChange={(query) => setProductQuery(query)}
              filter={(value, selected, item) =>
                !selected && item.label?.toLowerCase()?.includes(value.toLowerCase().trim())
              }
              searchable
              limit={20}
              nothingFound="Бараа олдсонгүй"
              maxDropdownHeight={400}
              {...form.getInputProps('productids')}
            />
          )}
          <DateTimePicker
            dropdownType="modal"
            placeholder="Эхлэх огноог оруулна уу"
            label="Эхлэх огноо"
            size="xs"
            valueFormat="YYYY-MM-DD hh:mm A"
            {...form.getInputProps('start_date')}
          />
          <DateTimePicker
            dropdownType="modal"
            placeholder="Дуусах огноог оруулна уу"
            label="Дуусах огноо"
            size="xs"
            valueFormat="YYYY-MM-DD hh:mm A"
            {...form.getInputProps('end_date')}
          />
          <>
            <Text size="xs" weight={500} mt="xs">
              Icon зураг оруулах
            </Text>
            <Dropzone
              maxFiles={1}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
              onDrop={handleImageDrop}
              loading={isFileUploading}
            >
              <Text align="center" size="sm">
                Та файлаа энд хуулна уу
              </Text>
            </Dropzone>
            <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt="xl">
              {file && previews}
            </SimpleGrid>
          </>
        </Stack>
        <Group position="right" mt="xl">
          <Button variant="subtle" radius="xl" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button type="submit" radius="xl" loading={loading}>
            {initialData?.create ? 'Үүсгэх' : 'Хадгалах'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default DealModal;
