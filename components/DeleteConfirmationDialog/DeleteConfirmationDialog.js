import { Button, Group, Modal, Text } from '@mantine/core';
export function DeleteConfirmationDialog({
  isOpen,
  close,
  confirmationText,
  productData = {},
  onConfirm,
  loading,
}) {
  return (
    <Modal opened={isOpen} onClose={close} title={confirmationText} centered>
      {/* <TextInput
            mt="sm"
            // label="Ангиллын нэр"
            placeholder="Ангиллын нэр"
            min={0}
            {...form.getInputProps('name')}
          /> */}
      <Text size="sm" weight={500} p="xs">
        {productData?.name}
      </Text>
      <Group position="right" mt="xl">
        <Button variant="default" radius="xl" onClick={close}>
          Цуцлах
        </Button>
        <Button
          type="submit"
          radius="xl"
          loading={loading}
          onClick={(e) => onConfirm(productData?.id)}
          color="red"
        >
          Идэвхигүй болгох
        </Button>
      </Group>
    </Modal>
  );
}
