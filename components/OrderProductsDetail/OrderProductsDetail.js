import { Card, Group, rem, Stack, Text } from '@mantine/core';

function OrderProductDetail({ products }) {
  return (
    <Group px={12} py="xs" spacing="lg" align="flex-start">
      <Stack p="xs" spacing="sm">
        <Group spacing={6}>
          <Text weight={500} lineClamp={3}>
            Захиалсан бараанууд:
          </Text>
        </Group>
        <Group align="flex-start">
          {products?.map((e) => {
            return (
              <Card
                shadow="sm"
                withBorder
                py="xs"
                px="md"
                key={`order-product-${e.id}`}
                maw={rem(250)}
                mih={rem(160)}
              >
                <Card.Section inheritPadding withBorder pt="md" pb="xs">
                  <Text fw={500}>{e?.product?.name || e?.name}</Text>
                </Card.Section>
                <Stack spacing="sm">
                  <Group position="apart" mt="xs" noWrap>
                    <Text>Тоо ширхэг:</Text>
                    {/* <Text>{e.qty + e.product.unit}</Text> */}
                    <Text>{e?.qty}</Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text>Нэгж үнэ:</Text>
                    <Text>
                      {Intl.NumberFormat('mn', {
                        style: 'currency',
                        currency: 'MNT',
                        currencyDisplay: 'narrowSymbol',
                      }).format(e?.price)}
                    </Text>
                  </Group>
                  <Group position="apart" noWrap>
                    <Text>Нийт үнэ:</Text>
                    <Text>
                      {Intl.NumberFormat('mn', {
                        style: 'currency',
                        currency: 'MNT',
                        currencyDisplay: 'narrowSymbol',
                      }).format(e?.price * e?.qty)}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            );
          })}
        </Group>
      </Stack>
    </Group>
  );
}

export default OrderProductDetail;
