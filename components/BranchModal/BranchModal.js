import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  SimpleGrid,
  ActionIcon,
  Image,
  Highlight,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconX } from '@tabler/icons';

import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import Map from '../Map';
import MapEvents from '../Map/MapEvents';
import { useEditor } from '@tiptap/react';
import { CustomRichTextEditor } from '../CustomRichTextEditor/CustomRichTextEditor';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from 'next/link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import axios from 'axios';

export function BranchModal({ opened, close, loading, onSubmit, initialData, userToken }) {
  const defaultLatLng = { lat: 47.8864, lng: 106.9057 };
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const form = useForm({
    initialValues: {
      name: '',
      images: [],
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Нэр оруулна уу'),
    },
  });
  const [isFileUploading, setIsFileUploading] = useState(false);

  const [latLng, setLatLng] = useState({
    lat: 47.8864,
    lng: 106.9057,
  });

  const [editors, setEditors] = useState({
    addressContent: '',
    timeTableContent: '',
    phoneContent: '',
  });
  const addressEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });
  const phoneEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });
  const timeTableEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });
  useEffect(() => {
    if (!addressEditor) return;
    addressEditor.commands.setContent(editors.addressContent);
  }, [addressEditor, editors]);

  useEffect(() => {
    if (!phoneEditor) return;
    phoneEditor.commands.setContent(editors.phoneContent);
  }, [phoneEditor, editors]);

  useEffect(() => {
    if (!timeTableEditor) return;
    timeTableEditor.commands.setContent(editors.timeTableContent);
  }, [timeTableEditor, editors]);

  useEffect(() => {
    if (initialData?.name) {
      form.setFieldValue('name', initialData?.name);
      form.setFieldValue('images', initialData?.img_url);
      setLatLng({ lat: initialData?.latitute, lng: initialData?.longtitute });

      setEditors({
        addressContent: initialData?.address,
        phoneContent: initialData?.phone,
        timeTableContent: initialData?.time_table,
      });
    }
  }, [initialData]);

  const handleSubmit = async (fields) => {
    const allFields = {
      ...fields,
      latitute: latLng.lat,
      longtitute: latLng.lng,
      address: addressEditor.getHTML(),
      phone: phoneEditor.getHTML(),
      time_table: timeTableEditor.getHTML(),
    };
    await onSubmit(allFields);
    form.reset();
    setLatLng({ lat: defaultLatLng.lat, lng: defaultLatLng.lng });
    setEditors({
      addressContent: '',
      phoneContent: '',
      timeTableContent: '',
    });
    close();
  };

  const handleClose = () => {
    form.reset();
    setLatLng({ lat: defaultLatLng.lat, lng: defaultLatLng.lng });
    setEditors({
      addressContent: '',
      phoneContent: '',
      timeTableContent: '',
    });
    close();
  };

  const handleImageDrop = async (acceptedFiles) => {
    const formData = new FormData();
    if (acceptedFiles) {
      setIsFileUploading(true);
      for (const file of acceptedFiles) {
        formData.append('img', file, file.name);
        formData.append('folder', 'branch');
        axios
          .post(`${process.env.NEXT_PUBLIC_API}/admin/product/upload`, formData, config)
          .then((value) => {
            if (value.status === 200) {
              const imgUrl = value.data.url;
              form.insertListItem('images', imgUrl);
            }
            return setIsFileUploading(false);
          })
          .catch((err) => setIsFileUploading(false));
        formData.delete('img');
      }
    }
  };

  return (
    <Modal
      opened={opened}
      size="lg"
      onClose={handleClose}
      title={<Text>Шинэ салбар бүртгэх</Text>}
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack>
          <TextInput
            mt="sm"
            label="Салбарын нэр"
            placeholder="Салбарын нэр"
            size="xs"
            min={0}
            {...form.getInputProps('name')}
          />
          <Stack spacing={4}>
            <Text weight={500} size="xs">
              Байршлын дэлгэрэнгүй мэдээлэл
            </Text>
            <CustomRichTextEditor editor={addressEditor} />
          </Stack>
          <Stack spacing={4}>
            <Text weight={500} size="xs">
              Холбоо барих мэдээлэл
            </Text>
            <CustomRichTextEditor editor={phoneEditor} />
          </Stack>

          <Stack spacing={4}>
            <Text weight={500} size="xs">
              Цагийн хуваарийн мэдээлэл
            </Text>
            <CustomRichTextEditor editor={timeTableEditor} />
          </Stack>

          <>
            <Text size="xs" weight={500}>
              Салбарын зураг оруулах
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
          </>
          <Stack spacing={4} mt={10}>
            <Text weight={500} size="xs">
              Газрын зураг дээрх байршил
            </Text>
            <Map
              width="800"
              height="400"
              center={[latLng.lat, latLng.lng]}
              zoom={initialData?.create ? 10 : 15}
            >
              {({ TileLayer, Marker, Popup }) => (
                <>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[latLng.lat, latLng.lng]}>
                    {/* <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup> */}
                  </Marker>
                  <MapEvents setLatLng={setLatLng} />
                </>
              )}
            </Map>
          </Stack>
        </Stack>
        <Group position="right" mt="xl">
          <Button variant="subtle" radius="xl" onClick={handleClose}>
            Цуцлах
          </Button>
          <Button radius="xl" type="submit" loading={loading}>
            {initialData?.create ? 'Үүсгэх' : 'Хадгалах'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
