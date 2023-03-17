import {
  Container,
  Grid,
  Title,
  Tabs,
  Box,
  MediaQuery,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Flex,
  Indicator,
  ActionIcon,
  Chip,
  TextInput,
  Menu,
  Modal,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import { IconEdit, IconPlus, IconSearch, IconUsers } from '@tabler/icons';
import { CategoryModal } from '../../components/CategoryModal/CategoryModal';

function Category({ categories }) {
  const [selectedRecords, setSelectedRecords] = useState([]);
  useEffect(() => {
    console.log(selectedRecords);
  }, [selectedRecords]);
  const [opened, { open, close }] = useDisclosure(false);
  const [type, setType] = useState('');
  const useCategoryModal = (type) => {
    setType(type);
    open();
  };
  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <Flex direction="column" gap={40}>
          <Group position="apart" grow>
            <Text size="lg" weight={500}>
              Ангилалууд
            </Text>
            <Group position="apart" noWrap>
              <TextInput
                placeholder="Ангилал хайх"
                rightSection={<IconSearch size="1rem" />}
                radius="xl"
                styles={{ root: { flexGrow: 2 } }}
              />
              <Menu shadow="md" withArrow>
                <Menu.Target>
                  <Button variant="filled" radius="xl" styles={{ label: { padding: 12 } }}>
                    Ангилал Үүсгэх
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Ямар ангилал үүсгэх вэ?</Menu.Label>
                  <Menu.Item onClick={() => useCategoryModal('general')}>Ерөнхий ангилал</Menu.Item>
                  <Menu.Item onClick={() => useCategoryModal('parent')}>Дэд ангилал</Menu.Item>
                  <Menu.Item onClick={() => useCategoryModal('product')}>Барааны ангилал</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
          <Grid>
            {categories.map((mainCategory) => {
              return mainCategory?.parent_categories.map((parentCategory) => (
                <Grid.Col sm={6} md={3} lg={3}>
                  <Card withBorder shadow="sm" radius="md">
                    <Card.Section withBorder p={15}>
                      <Group position="apart" align="flex-start">
                        <Flex
                          mih={50}
                          gap="sm"
                          justify="flex-start"
                          align="flex-start"
                          direction="column"
                          wrap="wrap"
                        >
                          <Text weight={500} size="sm">
                            {mainCategory.name}
                          </Text>
                          <Group>
                            <Indicator color="blue" />
                            <Text weight="bold">{parentCategory.name}</Text>
                          </Group>
                        </Flex>
                        <ActionIcon variant="filled" radius="lg" bg="blue">
                          <IconEdit size={18} />
                        </ActionIcon>
                      </Group>
                    </Card.Section>
                    <Flex mt={10} gap={14} direction="column">
                      <Group position="apart">
                        <Text size="sm">Дэд ангилалууд</Text>
                        <Text size="sm">Нийт: {parentCategory.child_categories.length}</Text>
                      </Group>
                      <Flex
                        justify="flex-start"
                        align="flex-start"
                        direction="row"
                        wrap="wrap"
                        gap="xs"
                      >
                        {parentCategory.child_categories.map((childCategory) => (
                          <Badge
                            variant="light"
                            py={14}
                            px={10}
                            styles={{
                              inner: { textTransform: 'capitalize', fontWeight: 'normal' },
                            }}
                          >
                            {childCategory.name}
                          </Badge>
                        ))}
                      </Flex>
                    </Flex>
                  </Card>
                </Grid.Col>
              ));
            })}
          </Grid>
        </Flex>
      </Container>
      <CategoryModal opened={opened} close={close} type="general">
        {/* Modal content */}
      </CategoryModal>
    </DefaultLayout>
  );
}
export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/category/all`);
  const data = await res.json();

  // Pass data to the page via props
  return {
    props: {
      categories: data.data,
    },
  };
}

export default Category;
