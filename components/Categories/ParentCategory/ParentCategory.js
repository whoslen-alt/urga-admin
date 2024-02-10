import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Indicator,
  List,
  Loader,
  LoadingOverlay,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconTrash } from '@tabler/icons';
import { IconEdit, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useCategories } from '../../../hooks';

const PAGE_SIZE = 15;

const ParentCategory = () => {
  const beingEditedCategory = false;
  const [moreHovered, setMoreHovered] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { data: childrenCatData, isFetching: isFetchingChildren } = useCategories(
    '3',
    1000,
    pageNumber - 1
  );
  const { data, isPending, isFetching } = useCategories('2', 1000, pageNumber - 1);
  const { data: mainCatData, isFetching: isFetchingMain } = useCategories(
    '1',
    1000,
    pageNumber - 1
  );
  if (isFetchingChildren || isFetching || isFetchingMain) return <Loader />;
  return (
    <Grid>
      {data?.categories?.map((parentCategory) => {
        const parents = mainCatData?.categories?.filter((e) => e.id === parentCategory.parentId);
        const children = childrenCatData?.categories?.filter(
          (e) => e.parentId === parentCategory.id
        );
        return (
          <Grid.Col
            sm={12}
            md={6}
            lg={4}
            key={`parent-key-${parentCategory.id}-${parentCategory.name}`}
          >
            <Card
              withBorder
              shadow="sm"
              radius="md"
              style={
                beingEditedCategory && beingEditedCategory !== parentCategory.id
                  ? { filter: 'blur(3px)' }
                  : {}
              }
            >
              {beingEditedCategory === parentCategory.id ? (
                <form
                  onSubmit={form.onSubmit((values) => {
                    updating
                      ? null
                      : updateCategory(values).finally(() => setBeingEditedCategory(null));
                  })}
                >
                  <Stack pos="relative">
                    <LoadingOverlay visible={updating} overlayBlur={2} />
                    <TextInput
                      label="Ангиллын нэр"
                      placeholder="Засварлах ангиллын нэр оруулна уу"
                      size="xs"
                      {...form.getInputProps('name')}
                    />
                    <Select
                      size="xs"
                      label="Хамаарах ерөнхий ангилал"
                      placeholder="Ерөнхий ангилал сонгоно уу"
                      withinPortal
                      data={mainCategories.map((e) => {
                        return { value: e.id.toString(), label: e.name };
                      })}
                      {...form.getInputProps('main_cat_id')}
                    />
                    <Select
                      size="xs"
                      label="Идэвхитэй эсэх"
                      data={[
                        { value: true, label: 'Идэвхитэй' },
                        { value: false, label: 'Идэвхигүй' },
                      ]}
                      {...form.getInputProps('active')}
                    />
                    {/* <FileInput
                                  {...form.getInputProps('upload_image')}
                                  label="Icon зураг оруулах"
                                  onChange={(value) => {
                                    handleDropImage(value);
                                    if (form.getInputProps(`upload_image`).onChange)
                                      form.getInputProps(`upload_image`).onChange(value);
                                  }}
                                  placeholder="png, jpg зураг оруулна уу!"
                                  accept="image/png,image/jpeg"
                                /> */}

                    {/* {image ? (
                                  <Group position="center">
                                    <Image
                                      src={image}
                                      alt="Uploaded Preview"
                                      width={150}
                                      height={150}
                                    />
                                    <Button
                                      variant="light"
                                      onClick={handleClearImage}
                                      radius="lg"
                                      w="100%"
                                      color="red"
                                      leftIcon={<IconX size={16} />}
                                    >
                                      Арилгах
                                    </Button>
                                  </Group>
                                ) : null} */}
                    <div>
                      <Text size="xs" weight="bold">
                        Icon зураг оруулах
                      </Text>
                      <Dropzone
                        mt="xs"
                        maxFiles={1}
                        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
                        onDrop={(files) => handleImageDrop(files)}
                        loading={isFileUploading}
                      >
                        <Text align="center" size="sm">
                          Та файлаа энд хуулна уу
                        </Text>
                      </Dropzone>
                      <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} mt="xl">
                        {form.values.icon && (
                          <Stack spacing={0} pos="relative">
                            <Image src={form.values.icon} withPlaceholder />
                            <ActionIcon
                              variant="filled"
                              radius="xl"
                              color="red"
                              size="xs"
                              pos="absolute"
                              top={-10}
                              right={-10}
                              onClick={() => form.setFieldValue('icon', null)}
                            >
                              <IconX size="0.8rem" />
                            </ActionIcon>
                          </Stack>
                        )}
                      </SimpleGrid>
                    </div>
                    <Stack mt={10} spacing={14}>
                      <Group position="apart">
                        <Text size="sm">Хамаарах ангилалууд</Text>
                        <Text size="sm">Нийт: {children.length}</Text>
                      </Group>
                      <Flex
                        justify="flex-start"
                        align="flex-start"
                        direction="row"
                        wrap="wrap"
                        gap="xs"
                      >
                        {children.slice(0, 5).map((childCategory) => (
                          <Badge
                            key={`parent-children-key-${childCategory.id}-${childCategory.name}`}
                            variant="light"
                            py={14}
                            px={10}
                            styles={{
                              inner: {
                                textTransform: 'none',
                                fontWeight: 'normal',
                              },
                            }}
                          >
                            {childCategory.name}
                          </Badge>
                        ))}
                        {children.length > 5 && (
                          <Popover
                            width={200}
                            position="bottom"
                            withArrow
                            shadow="md"
                            withinPortal
                            opened={moreHovered === parentCategory.id}
                          >
                            <Popover.Target>
                              <Badge
                                styles={{
                                  inner: {
                                    cursor: 'default',
                                  },
                                }}
                                variant="light"
                                py={14}
                                px={10}
                                onMouseEnter={() => setMoreHovered(parentCategory.id)}
                                onMouseLeave={() => setMoreHovered()}
                              >
                                +{children.length - 5}
                              </Badge>
                            </Popover.Target>
                            <Popover.Dropdown>
                              <Stack>
                                <List size="xs">
                                  {children.slice(5, children.length).map((other) => (
                                    <List.Item
                                      key={`parent-children-key-${other.id}-${other.name}`}
                                    >
                                      {other.name}
                                    </List.Item>
                                  ))}
                                </List>
                              </Stack>
                            </Popover.Dropdown>
                          </Popover>
                        )}
                      </Flex>
                    </Stack>
                    <Group spacing="sm" position="right">
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={
                          updating
                            ? null
                            : (e) => {
                                setBeingEditedCategory(null);
                              }
                        }
                      >
                        Цуцлах
                      </Button>
                      <Button type="submit" variant="light">
                        Хадгалах
                      </Button>
                    </Group>
                  </Stack>
                </form>
              ) : (
                <Card.Section withBorder p={15} variant="">
                  <Group position="apart" align="flex-start" grow>
                    <Stack mih={50} spacing="sm">
                      <Group position="apart" grow>
                        {parents.map((e) => (
                          <Text weight={500} size="xs" key={`parent-parents-key-${e.id}-${e.name}`}>
                            {e.name}
                          </Text>
                        ))}
                        {/* <Group spacing="sm" position="right">
                          <ActionIcon
                            variant="light"
                            radius="lg"
                            color="blue"
                            onClick={() => {
                              form.setValues({
                                id: parentCategory.id,
                                name: parentCategory.name,
                                main_cat_id: parentCategory?.main_cat_id?.toString(),
                                icon: parentCategory?.icon,
                                active: parentCategory.active,
                              });
                              setBeingEditedCategory(parentCategory.id);
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            radius="lg"
                            color="red"
                            onClick={(e) => {
                              openDeleteConfirmation(parentCategory.id, parentCategory.name);
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group> */}
                      </Group>
                      <Group>
                        <Indicator color="blue" />
                        <Text weight="bold">{parentCategory.name}</Text>
                      </Group>
                    </Stack>
                  </Group>
                </Card.Section>
              )}
              {beingEditedCategory === parentCategory.id ? (
                <div></div>
              ) : (
                <Stack mt={10} spacing={14}>
                  <Group position="apart">
                    <Text size="sm">Хамаарах ангилалууд</Text>
                    <Text size="sm">Нийт: {children.length}</Text>
                  </Group>
                  <Flex
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                    gap="xs"
                  >
                    {children.slice(0, 5).map((childCategory) => (
                      <Badge
                        key={`parent-children-key-${childCategory.id}-${childCategory.name}`}
                        variant="light"
                        py={14}
                        px={10}
                        styles={{
                          inner: { textTransform: 'none', fontWeight: 'normal' },
                        }}
                      >
                        {childCategory.name}
                      </Badge>
                    ))}
                    {children.length > 5 && (
                      <Popover
                        width={200}
                        position="bottom"
                        withArrow
                        shadow="md"
                        withinPortal
                        opened={moreHovered === parentCategory.id}
                      >
                        <Popover.Target>
                          <Badge
                            styles={{
                              inner: {
                                cursor: 'default',
                              },
                            }}
                            variant="light"
                            py={14}
                            px={10}
                            onMouseEnter={() => setMoreHovered(parentCategory.id)}
                            onMouseLeave={() => setMoreHovered()}
                          >
                            +{children.length - 5}
                          </Badge>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Stack>
                            <List size="xs">
                              {children.slice(5, children.length).map((other) => (
                                <List.Item key={`parent-children-key-${other.id}-${other.name}`}>
                                  {other.name}
                                </List.Item>
                              ))}
                            </List>
                          </Stack>
                        </Popover.Dropdown>
                      </Popover>
                    )}
                  </Flex>
                </Stack>
              )}
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default ParentCategory;
