import { Card, Group, Stack, Text } from '@mantine/core';

function OrderProductDetail({ products }) {
  return (
    <Group px={12} py="xs" spacing="lg" align="flex-start">
      <Stack p="xs" spacing="sm">
        <Group spacing={6}>
          <Text weight={500}>Захиалсан бараанууд:</Text>
        </Group>
        <Group>
          {products?.map((e) => {
            return (
              <Card shadow="sm" withBorder py="xs" px="md" key={`order-product-${e.id}`}>
                <Card.Section inheritPadding withBorder pt="md" pb="xs">
                  <Text fw={500}>{e.product.name}</Text>
                </Card.Section>
                <Group position="apart" grow mt="xs">
                  <Text>Тоо ширхэг:</Text>
                  <Text>{e.qty + e.product.unit}</Text>
                </Group>
                <Group position="apart" grow>
                  <Text>Нэгж үнэ:</Text>
                  <Text>
                    {Intl.NumberFormat('mn', {
                      style: 'currency',
                      currency: 'MNT',
                      currencyDisplay: 'narrowSymbol',
                    }).format(e.price)}
                  </Text>
                </Group>
                <Group position="apart" grow>
                  <Text>Нийт үнэ:</Text>
                  <Text>
                    {Intl.NumberFormat('mn', {
                      style: 'currency',
                      currency: 'MNT',
                      currencyDisplay: 'narrowSymbol',
                    }).format(e.price * e.qty)}
                  </Text>
                </Group>
              </Card>
            );
          })}
        </Group>
      </Stack>
    </Group>
  );
}

export default OrderProductDetail;
