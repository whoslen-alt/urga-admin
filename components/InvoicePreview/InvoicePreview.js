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
  Skeleton,
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
import { CustomRichTextEditor } from '../CustomRichTextEditor/CustomRichTextEditor';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { useInvoice, useInvoices } from '../../hooks/useInvoices';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

function InvoicePreview({ isOpen, close, orderId, userToken }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    editable: false,
    content: '',
  });

  const { data, isLoading } = useInvoice({ orderId }, userToken);

  useEffect(() => {
    editor?.commands?.setContent(data?.invoice);
  }, [data, orderId, isOpen]);

  const handleClose = () => {
    close();
  };
  const cssAppliedContent = (body) => `
    <div>
      <style>
        table {
          border-width: 1px;
          background-color: white;
          color: black;
        }
      </style>
      ${body}
    <div>
    `;

  return (
    <Modal
      closeOnEscape
      title={``}
      onClose={() => close()}
      opened={isOpen}
      centered
      withinPortal
      size="70%"
    >
      <Stack spacing="xs">
        {/* {editor && (
          <RichTextEditor editor={editor}>
            <RichTextEditor.Content />
          </RichTextEditor>
        )} */}
        {isLoading && <Skeleton visible />}
        <div
          dangerouslySetInnerHTML={{
            __html: cssAppliedContent(data?.invoice),
          }}
        />
      </Stack>
      <Group position="right" mt="xl">
        <Button type="submit" radius="xl" onClick={handleClose}>
          Болсон
        </Button>
      </Group>
    </Modal>
  );
}

export default InvoicePreview;
