import {
  Container,
  ActionIcon,
  Button,
  Grid,
  Text,
  ColorInput,
  SimpleGrid,
  Image,
  Stack,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { IconCheck, IconX } from '@tabler/icons';
import requireAuthentication from '../../lib/requireAuthentication';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useEditor } from '@tiptap/react';
import { Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { CustomRichTextEditor } from '../../components/CustomRichTextEditor/CustomRichTextEditor';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { swatches } from '../../lib/constants/swatches';

function WebConfig({ userToken }) {
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editors, setEditors] = useState({
    locationContent: '',
    workHourContent: '',
    contactContent: '',
  });
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const form = useForm({
    initialValues: {
      header_color: '',
      footer_color: '',
      background_color: '',
      logo: null,
    },
  });

  const locationEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });
  const workHourEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });
  const contactEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });
  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!locationEditor) return;
    locationEditor.commands.setContent(editors.locationContent);
  }, [locationEditor, editors]);

  useEffect(() => {
    if (!workHourEditor) return;
    workHourEditor.commands.setContent(editors.workHourContent);
  }, [workHourEditor, editors]);

  useEffect(() => {
    if (!contactEditor) return;
    contactEditor.commands.setContent(editors.contactContent);
  }, [contactEditor, editors]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await axios(`${process.env.NEXT_PUBLIC_API}/config/layout`, config);
      const configData = res.data?.data;
      if (configData) {
        form.setValues({
          header_color: configData?.header_color || '',
          footer_color: configData?.footer_color || '',
          background_color: configData?.background_color || '',
          logo: configData?.logo,
        });
        setEditors({
          locationContent: configData?.location,
          workHourContent: configData?.work_hours,
          contactContent: configData?.contact,
        });
      }
    } catch (e) {}
    setLoading(false);
  };
  const handleSubmit = async ({ header_color, footer_color, background_color, logo }) => {
    setLoading(true);
    const title = 'Веб сайтын тохиргоо';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/config/layout`,
        {
          header_color,
          footer_color,
          background_color,
          logo,
          location: locationEditor.getHTML(),
          work_hours: workHourEditor.getHTML(),
          contact: contactEditor.getHTML(),
        },
        config
      );
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchConfig();
      } else {
        showNotification({
          title,
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      e.response
        ? showNotification({
            title,
            message: e.response.data.message,
            color: 'red',
          })
        : showNotification({
            title,
            message: e.message,
            color: 'red',
          });
    }
    setLoading(false);
  };

  const handleImageDrop = async (acceptedFiles) => {
    const formData = new FormData();
    if (acceptedFiles) {
      setIsFileUploading(true);
      const file = acceptedFiles[0];
      formData.append('img', file, file.name);
      axios
        .post(`${process.env.NEXT_PUBLIC_API}/admin/upload`, formData, config)
        .then((value) => {
          if (value.status === 200) {
            const imgUrl = value.data.data;
            form.setFieldValue('logo', imgUrl);
          }
          return setIsFileUploading(false);
        })
        .catch((err) => setIsFileUploading(false));
    }
  };

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <Grid position="apart" grow>
        <Grid.Col span={2}>
          <Text size="lg" weight={500}>
            Веб сайтын тохиргоо
          </Text>
        </Grid.Col>
      </Grid>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await handleSubmit(values);
        })}
      >
        <Grid mt="lg" gutter="xl">
          <Grid.Col span={12}>
            <ColorInput
              label="Вебийн толгой хэсгийн өнгө"
              placeholder="Өнгө сонгоно уу"
              format="hex"
              swatches={swatches}
              {...form.getInputProps('header_color')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <ColorInput
              label="Вебийн хөл хэсгийн өнгө"
              placeholder="Өнгө сонгоно уу"
              format="hex"
              swatches={swatches}
              {...form.getInputProps('footer_color')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <ColorInput
              label="Вебийн дэвсгэр өнгө"
              placeholder="Өнгө сонгоно уу"
              format="hex"
              swatches={swatches}
              {...form.getInputProps('background_color')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text weight={500} size="sm">
              Байршлын мэдээлэл
            </Text>
            <CustomRichTextEditor editor={locationEditor} />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text weight={500} size="sm">
              Ажлын цагийн мэдээлэл
            </Text>
            <CustomRichTextEditor editor={workHourEditor} />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text weight={500} size="sm">
              Холбоо барих мэдээлэл
            </Text>
            <CustomRichTextEditor editor={contactEditor} />
          </Grid.Col>

          <Grid.Col span={12}>
            <Text weight={500} size="sm">
              Вебийн лого
            </Text>
            <div>
              <Dropzone
                mt="xs"
                maxFiles={1}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
                onDrop={(acceptedFiles) => {
                  handleImageDrop(acceptedFiles);
                }}
                loading={isFileUploading}
              >
                <Text align="center" size="sm">
                  Та файлаа энд хуулна уу
                </Text>
              </Dropzone>
              <SimpleGrid cols={7} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt="xl">
                {form.values.logo && (
                  <Stack spacing={0} pos="relative">
                    <Image src={form.values.logo} withPlaceholder fit="contain" />
                    <ActionIcon
                      variant="filled"
                      radius="xl"
                      color="red"
                      size="xs"
                      pos="absolute"
                      top={-10}
                      right={-10}
                      onClick={() => form.setFieldValue('logo', null)}
                    >
                      <IconX size="0.8rem" />
                    </ActionIcon>
                  </Stack>
                )}
              </SimpleGrid>
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Button fullWidth type="submit">
              Хадгалах
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
}

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  // const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/config/layout`, {
  //   headers: {
  //     Authorization: `Bearer ${req.cookies.urga_admin_user_jwt}`,
  //   },
  // });
  return {
    props: {
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default WebConfig;
