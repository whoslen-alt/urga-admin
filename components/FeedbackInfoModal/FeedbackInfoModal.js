import { Button, Divider, Group, Modal, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

function FeedbackInfoModal({ detail, opened, close, loading, onSubmit }) {
  const { title = '', type = '', isReply = false } = detail || {};

  const form = useForm({
    initialValues: {
      subject: '',
      body: '',
    },

    validate: {
      body: isNotEmpty('Бичих шаардлагатай'),
      subject: isNotEmpty('Бичих шаардлагатай'),
    },
  });

  useEffect(() => {
    if (!opened) {
      form.reset();
    }
  }, [opened]);

  const feedbackText = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        Subscript,
        Highlight,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content: detail?.text,
      editable: false,
    },
    [detail]
  );

  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Modal title={title} opened={opened} onClose={close} centered>
      <Stack spacing="xs">
        <Text size="xs" weight="bold">
          Дэлгэрэнгүй мэдээлэл
        </Text>
        <RichTextEditor editor={feedbackText}>
          <RichTextEditor.Content />
        </RichTextEditor>
      </Stack>
      {isReply && (
        <>
          <Divider my="lg" />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="xs">
              <TextInput
                label="Санал хүсэлтийн хариу"
                placeholder="Гарчиг"
                size="xs"
                {...form.getInputProps('subject')}
              />
              <Textarea placeholder="Хариулт" size="xs" {...form.getInputProps('body')} />
            </Stack>
            <Group position="right" mt="xl">
              <Button variant="subtle" radius="xl" onClick={handleClose}>
                Цуцлах
              </Button>
              <Button type="submit" radius="xl" loading={loading}>
                Хариулт илгээх
              </Button>
            </Group>
          </form>
        </>
      )}
    </Modal>
  );
}

export default FeedbackInfoModal;
