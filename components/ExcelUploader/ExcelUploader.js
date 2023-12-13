import { Modal, Button, Group, FileInput, LoadingOverlay, Stack, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons';
// import IconExcel from '~icons/mdi/file-excel-outline.jsx';
import { useEffect } from 'react';
function ExcelUploader({ isOpen, close, onSubmit, loading }) {
  const form = useForm({
    initialValues: {
      file: null,
      images: [],
    },
    validate: {
      file: (value) => (value ? null : 'Файл хуулна уу'),
    },
  });
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, []);

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      title={'Excel файлаар бараа оруулах'}
      size="lg"
      centered
      closeOnClickOutside={false}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <form
        onSubmit={form.onSubmit(async (values, e) => {
          await onSubmit(values);
          form.reset();
          close();
        })}
      >
        <Stack mt="lg">
          <FileInput
            label="Бараа бүртгэлийн файл"
            description="Зөвхөн бараа бүртгэлийн загварын дагуу бэлтгэгдсэн excel файл байна"
            placeholder="Файл хуулах"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            // icon={<IconExcel style={{ fontSize: rem(14) }} />}
            {...form.getInputProps('file')}
          />
          <FileInput
            label="Бараануудын зураг"
            description="Зурган файлын нэр нь дүрмийн дагуу нэрлэгдсэн байна"
            placeholder="Файлууд хуулах"
            accept="image/png,image/jpeg,image/webp"
            multiple
            icon={<IconUpload size={rem(14)} />}
            {...form.getInputProps('images')}
          />
          <Group position="right">
            <Button variant="default" onClick={close}>
              Цуцлах
            </Button>
            <Button type="submit">Илгээх</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default ExcelUploader;
