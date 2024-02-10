import {
  Container,
  Grid,
  Tabs,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Flex,
  Indicator,
  ActionIcon,
  TextInput,
  Menu,
  MultiSelect,
  Stack,
  FileInput,
  Select,
  LoadingOverlay,
  Popover,
  List,
  SimpleGrid,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import { IconCheck, IconEdit, IconTrash, IconX, IconPlus } from '@tabler/icons';
import { CategoryModal } from '../../components/CategoryModal/CategoryModal';
import dayjs from 'dayjs';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import CategoryEditor from '../../components/CategoryEditor/CategoryEditor';
import requireAuthentication from '../../lib/requireAuthentication';
import { isNotEmpty, useForm } from '@mantine/form';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useRouter } from 'next/router';
import MainCategory from '../../components/Categories/MainCategory/MainCategory';
import ParentCategory from '../../components/Categories/ParentCategory/ParentCategory';
import ChildCategory from '../../components/Categories/ChildCategory/ChildCategory';
const PAGE_SIZE = 15;
function Category({ mainCats, parentCats, childCats, userToken }) {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      id: '',
      name: '',
      main_cat_id: '',
      icon: null,
      active: undefined,
    },
    validate: {
      name: isNotEmpty('Нэр оруулна уу'),
    },
  });
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
  const [beingEditedCategory, setBeingEditedCategory] = useState();
  const [moreHovered, setMoreHovered] = useState();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [type, setType] = useState('');
  const [isFileUploading, setIsFileUploading] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const openDeleteConfirmation = (categoryId, categoryName) => {
    setDeletingCategoryData({ id: categoryId, name: categoryName });
    handler.open();
  };

  const handleImageDrop = async (acceptedFiles, imageFieldSetter) => {
    const formData = new FormData();
    if (acceptedFiles) {
      setIsFileUploading(true);
      const file = acceptedFiles[0];
      formData.append('img', file, file.name);
      axios
        .post(`${process.env.NEXT_PUBLIC_API}/admin/upload`, formData, config)
        .then((value) => {
          if (value.status === 200) {
            const imgUrl = value.data.data;
            if (imageFieldSetter) {
              imageFieldSetter(imgUrl);
            } else {
              form.setFieldValue('icon', imgUrl);
            }
          }
          return setIsFileUploading(false);
        })
        .catch((err) => setIsFileUploading(false));
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/admin/category/all?type=separate`);
      const data = await res.json();

      setMainCategories(data.data.mainCats);
      setParentCategories(data.data.parentCats);
      setChildCategories(data.data.childCats);

      setMainCatRecords(data.data.mainCats.slice(0, PAGE_SIZE));
      setChildCatRecords(data.data.childCats.slice(0, PAGE_SIZE));
    } catch (e) {}
  };
  const createCategory = async (values, categoryType) => {
    setCreating(true);

    let body = {
      name: values.name,
      main_cat_id: values.main_cat_id,
    };
    if (categoryType === 'parent') {
      body.icon = values.icon;
    }
    if (categoryType === 'child') {
      body.parent_id = values.parent_cat_id;
    }
    const title = 'Ангилал үүсгэлт';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/category/${categoryType}`,
        body,
        config
      );

      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchAllCategories();
      } else {
        showNotification({
          title: title + ' амжилтгүй',
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      showNotification({
        title: title + ' амжилтгүй',
        message: e.response.data.message,
        color: 'red',
      });
    }
    setCreating(false);
  };
  const deleteCategory = async (id) => {
    setDeleting(true);
    const title = 'Ангилал устгалт';
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/category/${activeTab}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          ...(activeTab === 'main'
            ? { main_id: id }
            : activeTab === 'parent'
            ? { parent_id: id }
            : { child_id: id }),
        },
      });
      if (res.status === 200 && res.data?.success) {
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

    let body = {
      name: values.name,
      active: values.active,
    };

    if (activeTab === 'main') {
      body.main_id = values.id;
    } else if (activeTab === 'parent') {
      body.parent_id = values.id;
      body.main_cat_id = values.main_cat_id;
      body.icon = values.icon;
    } else {
      body.child_id = values.id;
      body.parent_id = values.parent_cat_id;
      body.main_cat_id = values.main_cat_id;
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/category/${activeTab}`,
        body,
        config
      );
      if (res.status === 200 && res.data?.success) {
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
        message: e.response.data.message,
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
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <CategoryModal
        opened={opened}
        close={close}
        type={type}
        creating={creating}
        onSubmit={createCategory}
        handleImageDrop={handleImageDrop}
        isFileUploading={isFileUploading}
      />
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
          {/* <Grid.Col span={4}>
                <TextInput
                  placeholder="Ангилал хайх"
                  rightSection={<IconSearch size="1rem" />}
                  radius="xl"
                  styles={{ root: { flexGrow: 2 } }}
                />
              </Grid.Col> */}
        </Grid>
        <Tabs value={router.query.type} onTabChange={(value) => router.push(`/category/${value}`)}>
          <Tabs.List>
            <Tabs.Tab value="main"> Ерөнхий ангилал</Tabs.Tab>
            <Tabs.Tab value="parent">Дэд ангилал</Tabs.Tab>
            <Tabs.Tab value="child">Барааны ангилал</Tabs.Tab>
            {/* <Menu shadow="md" withArrow>
              <Menu.Target>
                <Button
                  ml="auto"
                  variant="filled"
                  leftIcon={<IconPlus />}
                  sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                  styles={{ label: { padding: 12 } }}
                >
                  Ангилал Үүсгэх
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Ямар ангилал үүсгэх вэ?</Menu.Label>
                <Menu.Item onClick={() => useCategoryModal('main')}>Ерөнхий ангилал</Menu.Item>
                <Menu.Item onClick={() => useCategoryModal('parent')}>Дэд ангилал</Menu.Item>
                <Menu.Item onClick={() => useCategoryModal('child')}>Барааны ангилал</Menu.Item>
              </Menu.Dropdown>
            </Menu> */}
          </Tabs.List>
          <Tabs.Panel value="main" pt="xl">
            <MainCategory userToken={userToken} />
          </Tabs.Panel>
          <Tabs.Panel value="parent" pt="xl">
            <ParentCategory />
          </Tabs.Panel>
          <Tabs.Panel value="child" pt="xl">
            <ChildCategory />
          </Tabs.Panel>
        </Tabs>
      </Flex>
    </Container>
  );
}

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  // const response = await axios.get(
  //   `${process.env.NEXT_PUBLIC_API}/admin/category/all?type=separate`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${req.cookies.urga_admin_user_jwt}`,
  //     },
  //   }
  // );
  return {
    props: {
      mainCats: [],
      parentCats: [],
      childCats: [],
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default Category;
