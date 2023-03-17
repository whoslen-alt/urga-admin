import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Flex,
  Grid,
  Group,
  MultiSelect,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconArrowBack, IconCheck } from '@tabler/icons';

function ProductDetails({ initialData, categories }) {
  return (
    <Group px={12} py="xs" spacing="lg" align="flex-start">
      <Stack p="xs" spacing="sm">
        <Group spacing={6}>
          <Text weight={500}>Ерөнхий ангилал:</Text>
          {(initialData?.main_cat_id === null || initialData?.main_cat_id.length === 0) && (
            <Text>Байхгүй</Text>
          )}
          {categories.mainCategories
            .filter((value) => initialData?.main_cat_id?.includes(value.id))
            .map((e) => {
              return (
                <Badge size="xs" variant="outline">
                  {e.name}
                </Badge>
              );
            })}
        </Group>
        <Group spacing={6}>
          <Text weight={500}>Дэд ангилал:</Text>
          {categories.parentCategories
            .filter((value) => initialData?.parent_cat_id?.includes(value.id))
            .map((e) => {
              return (
                <Badge size="xs" variant="outline">
                  {e.name}
                </Badge>
              );
            })}
        </Group>
        <Group spacing={6}>
          <Text weight={500}>Барааны ангилал:</Text>
          {categories.childCategories
            .filter((value) => initialData?.child_cat_id?.includes(value.id))
            .map((e) => {
              return (
                <Badge size="xs" variant="outline">
                  {e.name}
                </Badge>
              );
            })}
        </Group>
      </Stack>
      <Stack p="xs" spacing="sm" align="flex-start">
        <Group spacing={6}>
          <Text weight={500}>Савлагаа:</Text>
          <Text>
            {initialData.packaging} {initialData.unit}
          </Text>
        </Group>
        <Group spacing={6}>
          <Text weight={500}>Хямдралтай үнэ:</Text>
          <Text>{initialData.promo_price ? initialData.promo_price : 'Байхгүй'}</Text>
        </Group>
      </Stack>
      <Stack p="xs" spacing="sm" align="flex-start">
        <Group spacing={6}>
          <Text weight={500}>Бөөний тоо:</Text>
          <Text>{initialData.wholesale_price ? initialData.wholesale_price : 'Байхгүй'}</Text>
        </Group>
        <Group spacing={6}>
          <Text weight={500}>Бөөний үнэ:</Text>
          <Text>{initialData.wholesale_qty ? initialData.wholesale_qty : 'Байхгүй'}</Text>
        </Group>
      </Stack>
    </Group>
  );
}

export default ProductDetails;
