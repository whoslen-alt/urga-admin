import { Button, Group, Modal, Text } from '@mantine/core';
export function DeleteConfirmationDialog({
  isOpen,
  close,
  confirmationText,
  thingToDelete = {},
  onConfirm,
  loading,
}) {
  return (
    <Modal opened={isOpen} onClose={close} title={confirmationText} centered>
      {thingToDelete?.email && (
        <Group>
          <Text size="sm" p="xs">
            И-мейл:
          </Text>
          <Text size="sm" weight={500} p="xs">
            {thingToDelete?.email}
          </Text>
        </Group>
      )}
      <Group>
        <Text size="sm" p="xs">
          Нэр:
        </Text>
        <Text size="sm" weight={500} p="xs">
          {thingToDelete?.name}
        </Text>
      </Group>
      <Group position="right" mt="xl">
        <Button variant="default" radius="xl" onClick={close}>
          Цуцлах
        </Button>
        <Button
          type="submit"
          radius="xl"
          loading={loading}
          onClick={(e) => {
            onConfirm(thingToDelete?.id);
          }}
          color="red"
        >
          Идэвхигүй болгох
        </Button>
      </Group>
    </Modal>
  );
}
