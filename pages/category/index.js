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
  MultiSelect,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import { IconCheck, IconEdit, IconPlus, IconSearch, IconTrash, IconUsers } from '@tabler/icons';
import { CategoryModal } from '../../components/CategoryModal/CategoryModal';
import dayjs from 'dayjs';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import CategoryEditor from '../../components/CategoryEditor/CategoryEditor';

const PAGE_SIZE = 15;
function Category({ mainCats, parentCats, childCats }) {
  const [activeTab, setActiveTab] = useState('main');

  const [mainCategories, setMainCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const [mainCatPageNumber, setMainCatPageNumber] = useState(1);
  const [childCatPageNumber, setChildCatPageNumber] = useState(1);

  const [mainCatRecords, setMainCatRecords] = useState([]);
  const [childCatRecords, setChildCatRecords] = useState();

  useEffect(() => {
    setMainCategories(mainCats);
    setParentCategories(parentCats);
    setChildCategories(childCats);

    setMainCatRecords(mainCats.slice(0, PAGE_SIZE));
    setChildCatRecords(childCats.slice(0, PAGE_SIZE));
  }, []);

  useEffect(() => {
    const from = (mainCatPageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setMainCatRecords(mainCats.slice(from, to));
  }, [mainCatPageNumber]);

  useEffect(() => {
    const from = (childCatPageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setChildCatRecords(childCats.slice(from, to));
  }, [childCatPageNumber]);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [expandedRecordIds, setExpandedRecordIds] = useState([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [confirmModalOpen, handler] = useDisclosure(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [type, setType] = useState('');
  const multiSelectReadOnlyStyle = {
    input: {
      border: 'none',
      backgroundColor: 'transparent',
      ':hover': {
        cursor: 'default',
      },
    },
    searchInput: {
      ':hover': {
        cursor: 'default',
      },
    },
  };
  const openDeleteConfirmation = (categoryId, categoryName) => {
    setDeletingCategoryData({ id: categoryId, name: categoryName });
    handler.open();
  };
  const fetchAllCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/category/all?type=separate`);
      const data = await res.json();

      setMainCategories(data.data.mainCats);
      setParentCategories(data.data.parentCats);
      setChildCategories(data.data.childCats);

      setMainCatRecords(data.data.mainCats.slice(0, PAGE_SIZE));
      setChildCatRecords(data.data.childCats.slice(0, PAGE_SIZE));
    } catch (e) {}
  };
  const deleteCategory = async (id) => {
    setDeleting(true);
    const title = 'Ангилал устгалт';
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/category/${activeTab}`, {
        headers: {
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
        },
        data: {
          ...(activeTab === 'main'
            ? { main_id: id }
            : activeTab === 'parent'
            ? { parent_id: id }
            : { child_id: id }),
        },
      });
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        if (activeTab === 'main') {
          const from = (mainCatPageNumber - 1) * PAGE_SIZE;
          const to = from + PAGE_SIZE;
          setMainCategories((prev) => [...prev.filter((e) => e.id != id)]);
          setMainCatRecords(mainCategories.filter((e) => e.id != id).slice(from, to));
        } else if (activeTab === 'parent') {
          setParentCategories((prev) => [...prev.filter((e) => e.id != id)]);
        } else {
          const from = (childCatPageNumber - 1) * PAGE_SIZE;
          const to = from + PAGE_SIZE;
          setChildCategories((prev) => [...prev.filter((e) => e.id != id)]);
          setChildCatRecords(childCategories.filter((e) => e.id != id).slice(from, to));
        }
      } else {
        showNotification({
          title,
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      showNotification({
        title,
        message: e.message,
        color: 'red',
      });
    }
    setDeleting(false);
    handler.close();
  };
  const updateCategory = async (values) => {
    setUpdating(true);
    const title = 'Ангилал шинэчлэлт';
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/category/${activeTab}`,
        {
          name: values.name,
          active: values.active,
          ...(activeTab === 'main'
            ? { main_id: values.id }
            : activeTab === 'parent'
            ? { parent_id: values.id, main_cat_id: values.main_cat_id }
            : {
                child_id: values.id,
                parent_id: values.parent_id,
                main_cat_id: values.main_cat_id,
              }),
        },
        {
          headers: {
            Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
          },
        }
      );
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchAllCategories();
      } else {
        showNotification({
          title,
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      showNotification({
        title,
        message: e.message,
        color: 'red',
      });
    }
    setUpdating(false);
  };
  const useCategoryModal = (type) => {
    setType(type);
    open();
  };
  const [deletingCategoryData, setDeletingCategoryData] = useState({});
  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <DeleteConfirmationDialog
          isOpen={confirmModalOpen}
          close={handler.close}
          confirmationText="Доорх ангиллыг идэвхигүй болгох уу?"
          thingToDelete={deletingCategoryData}
          onConfirm={deleteCategory}
          loading={deleting}
        />
        <Flex direction="column" gap={20}>
          <Grid position="apart" grow>
            <Grid.Col span={4}>
              <Text size="lg" weight={500}>
                Ангиллууд
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                placeholder="Ангилал хайх"
                rightSection={<IconSearch size="1rem" />}
                radius="xl"
                styles={{ root: { flexGrow: 2 } }}
              />
            </Grid.Col>
            <Grid.Col span={1}>
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
            </Grid.Col>
          </Grid>
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="main"> Ерөнхий ангилал</Tabs.Tab>
              <Tabs.Tab value="parent">Дэд ангилал</Tabs.Tab>
              <Tabs.Tab value="child">Барааны ангилал</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="main" pt="xl">
              <DataTable
                fontSize="xs"
                borderRadius="sm"
                withBorder
                withColumnBorders
                highlightOnHover
                records={mainCatRecords}
                // selectedRecords={selectedRecords}
                // onSelectedRecordsChange={setSelectedRecords}
                totalRecords={mainCategories.length}
                recordsPerPage={PAGE_SIZE}
                page={mainCatPageNumber}
                onPageChange={(p) => setMainCatPageNumber(p)}
                rowExpansion={{
                  trigger: 'never',
                  expanded: {
                    recordIds: expandedRecordIds,
                    onRecordIdsChange: setExpandedRecordIds,
                  },
                  content: ({ record, collapse }) => (
                    <CategoryEditor
                      initialData={record}
                      type={activeTab}
                      categories={{ mainCategories, parentCategories, childCategories }}
                      collapse={collapse}
                      onSubmit={updateCategory}
                    />
                  ),
                }}
                columns={[
                  {
                    accessor: 'name',
                    title: 'Нэр',
                    width: 200,
                    render: (r) => <Text weight={500}>{r.name}</Text>,
                  },
                  {
                    accessor: 'children',
                    title: 'Дэд ангиллууд',
                    render: ({ id }) => (
                      <MultiSelect
                        size="xs"
                        placeholder="Байхгүй"
                        styles={multiSelectReadOnlyStyle}
                        data={parentCategories.map((e) => {
                          return { value: e.id.toString(), label: e.name };
                        })}
                        defaultValue={parentCategories
                          .filter((e) => e.id === id)
                          .map((e) => e.id.toString())}
                        readOnly
                      />
                    ),
                    width: 160,
                  },
                  {
                    accessor: 'active',
                    title: 'Идэвхитэй эсэх',
                    width: 70,
                    textAlignment: 'center',
                    render: (record) => (
                      <Badge
                        color={record.active ? 'green' : 'red'}
                        size="sm"
                        variant="filled"
                        styles={{
                          inner: {
                            textTransform: 'capitalize',
                            fontWeight: 500,
                          },
                          root: {
                            padding: '8px 8px 9px 8px',
                          },
                        }}
                      >
                        {record.active ? 'Идэвхитэй' : 'Идэвхигүй'}
                      </Badge>
                    ),
                  },

                  {
                    accessor: 'createdAt',
                    title: 'Үүсгэсэн огноо',
                    textAlignment: 'center',
                    sortable: true,
                    width: 90,
                    render: ({ createdAt }) => (
                      <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
                    ),
                  },
                  {
                    accessor: 'updatedAt',
                    title: 'Сүүлд засварласан огноо',
                    textAlignment: 'center',
                    sortable: true,
                    width: 90,
                    render: ({ updatedAt }) => (
                      <Text>{dayjs(updatedAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
                    ),
                  },
                  {
                    accessor: 'actions',
                    title: <Text>Үйлдэл</Text>,
                    textAlignment: 'center',
                    width: 60,
                    render: (record) => (
                      <Group spacing={4} position="center">
                        <ActionIcon
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing({
                              type: 'main',
                            });
                            setExpandedRecordIds([record.id]);
                            // openProductEditingModal(record);
                            // editInfo(company);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirmation(record.id, record.name);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ),
                  },
                ]}
              />
            </Tabs.Panel>
            <Tabs.Panel value="parent" pt="xl">
              <Grid>
                {parentCategories?.map((parentCategory) => {
                  const parents = mainCategories.filter((e) => e.id === parentCategory.main_cat_id);
                  const children = childCategories.filter((e) => e.parent_id === parentCategory.id);
                  return (
                    <Grid.Col
                      sm={6}
                      md={3}
                      lg={3}
                      key={`parent-key-${parentCategory.id}-${parentCategory.name}`}
                    >
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
                              {parents.map((e) => (
                                <Text
                                  weight={500}
                                  size="sm"
                                  key={`parent-parents-key-${e.id}-${e.name}`}
                                >
                                  {e.name}
                                </Text>
                              ))}

                              <Group>
                                <Indicator color="blue" />
                                <Text weight="bold">{parentCategory.name}</Text>
                              </Group>
                            </Flex>
                            <Flex gap="sm">
                              <ActionIcon variant="light" radius="lg" color="blue">
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
                            </Flex>
                          </Group>
                        </Card.Section>
                        <Flex mt={10} gap={14} direction="column">
                          <Group position="apart">
                            <Text size="sm">Барааны ангилалууд</Text>
                            <Text size="sm">Нийт: {children.length}</Text>
                          </Group>
                          <Flex
                            justify="flex-start"
                            align="flex-start"
                            direction="row"
                            wrap="wrap"
                            gap="xs"
                          >
                            {children.map((childCategory) => (
                              <Badge
                                key={`parent-children-key-${childCategory.id}-${childCategory.name}`}
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
                  );
                })}
              </Grid>
            </Tabs.Panel>
            <Tabs.Panel value="child" pt="xl">
              <DataTable
                fontSize="xs"
                borderRadius="sm"
                withBorder
                withColumnBorders
                highlightOnHover
                records={childCatRecords}
                // selectedRecords={selectedRecords}
                // onSelectedRecordsChange={setSelectedRecords}
                totalRecords={childCategories.length}
                recordsPerPage={PAGE_SIZE}
                page={childCatPageNumber}
                onPageChange={(p) => setChildCatPageNumber(p)}
                // rowExpansion={{
                //   content: ({ record }) => (
                //     <ProductDetails
                //       initialData={record}
                //       categories={{ mainCategories, parentCategories, childCategories }}
                //     />
                //   ),
                // }}
                columns={[
                  {
                    accessor: 'name',
                    title: 'Нэр',
                    width: 200,
                    render: (r) => <Text weight={500}>{r.name}</Text>,
                  },

                  {
                    accessor: 'main_categories',
                    title: 'Ерөнхий ангиллууд',
                    render: ({ id }) => (
                      <MultiSelect
                        size="xs"
                        placeholder="Байхгүй"
                        styles={multiSelectReadOnlyStyle}
                        data={mainCategories.map((e) => {
                          return { value: e.id.toString(), label: e.name };
                        })}
                        defaultValue={mainCategories
                          .filter((e) => e.id === id)
                          .map((e) => e.id.toString())}
                        readOnly
                      />
                    ),
                    width: 160,
                  },
                  {
                    accessor: 'parent_categories',
                    title: 'Дэд ангиллууд',
                    render: ({ id }) => (
                      <MultiSelect
                        size="xs"
                        placeholder="Байхгүй"
                        styles={multiSelectReadOnlyStyle}
                        data={parentCategories.map((e) => {
                          return { value: e.id.toString(), label: e.name };
                        })}
                        defaultValue={parentCategories
                          .filter((e) => e.id === id)
                          .map((e) => e.id.toString())}
                        readOnly
                      />
                    ),
                    width: 160,
                  },
                  {
                    accessor: 'active',
                    title: 'Идэвхитэй эсэх',
                    width: 70,
                    textAlignment: 'center',
                    render: (record) => (
                      <Badge
                        color={record.active ? 'green' : 'red'}
                        size="sm"
                        variant="filled"
                        styles={{
                          inner: {
                            textTransform: 'capitalize',
                            fontWeight: 500,
                          },
                          root: {
                            padding: '8px 8px 9px 8px',
                          },
                        }}
                      >
                        {record.active ? 'Идэвхитэй' : 'Идэвхигүй'}
                      </Badge>
                    ),
                  },
                  {
                    accessor: 'createdAt',
                    title: 'Үүсгэсэн огноо',
                    textAlignment: 'center',
                    sortable: true,
                    width: 90,
                    render: ({ createdAt }) => (
                      <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
                    ),
                  },
                  {
                    accessor: 'updatedAt',
                    title: 'Сүүлд засварласан огноо',
                    textAlignment: 'center',
                    sortable: true,
                    width: 90,
                    render: ({ updatedAt }) => (
                      <Text>{dayjs(updatedAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
                    ),
                  },
                  {
                    accessor: 'actions',
                    title: <Text>Үйлдэл</Text>,
                    textAlignment: 'center',
                    width: 60,
                    render: (record) => (
                      <Group spacing={4} position="center">
                        <ActionIcon
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            // openProductEditingModal(record);
                            // editInfo(company);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirmation(record.id, record.name);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    ),
                  },
                ]}
              />
            </Tabs.Panel>
          </Tabs>
        </Flex>
      </Container>
      <CategoryModal opened={opened} close={close} type="general">
        {/* Modal content */}
      </CategoryModal>
    </DefaultLayout>
  );
}
export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/category/all?type=separate`);
  const data = await res.json();

  return {
    props: {
      mainCats: data.data.mainCats,
      parentCats: data.data.parentCats,
      childCats: data.data.childCats,
    },
  };
}

export default Category;
