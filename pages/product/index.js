import {
  Container,
  Title,
  Tabs,
  Box,
  MediaQuery,
  Badge,
  Text,
  Group,
  ActionIcon,
  Stack,
  Grid,
  Center,
  TextInput,
  Button,
  Menu,
  Flex,
  Tooltip,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import {
  IconBox,
  IconCheck,
  IconEdit,
  IconPackage,
  IconPhoto,
  IconPhotoOff,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
  IconX,
} from '@tabler/icons';
import IconExcel from '~icons/vscode-icons/file-type-excel.jsx';

import axios from 'axios';
import ProductDetails from '../../components/ProductDetails/ProductDetails';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import ProductModal from '../../components/ProductModal/ProductModal';
import Image from 'next/image';
import { modals } from '@mantine/modals';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { showNotification } from '@mantine/notifications';
import requireAuthentication from '../../lib/requireAuthentication';
import ExcelUploader from '../../components/ExcelUploader/ExcelUploader';

const PAGE_SIZE = 15;

function Product({ products, total, mainCategories, parentCategories, childCategories }) {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState(products.slice(0, PAGE_SIZE));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState({ id: '', name: '' });
  const [opened, { open, close }] = useDisclosure(false);
  const [excelUploaderOpened, { open: openExcelUploader, close: closeExcelUploader }] =
    useDisclosure(false);
  const [confirmationOpened, handlers] = useDisclosure(false);
  const [editingProdData, setEditingProdData] = useState();
  const [debounced] = useDebouncedValue(query, 200);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(products.slice(from, to));
  }, [page]);
  // useEffect(() => {
  //   setRecords(
  //     initialRecords.filter(({ name }) => {
  //       if (query !== '' && !name.toLowerCase().includes(query.trim().toLowerCase())) {
  //         return false;
  //       }
  //       return true;
  //     })
  //   );
  // }, [query]);
  useEffect(() => {
    handleSearch();
  }, [query]);
  const handleSearch = () => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    if (query === '') {
      setRecords(products.slice(from, to));
    } else {
      setRecords(
        products.filter(({ name }) => {
          if (!name.toLowerCase().includes(query.trim().toLowerCase())) {
            return false;
          }
          return true;
        })
      );
    }
  };
  const fetchPage = async () => {
    setLoading(true);
    // const offset = pageNumber * PAGE_SIZE;
    const res = await axios(`${process.env.NEXT_PUBLIC_API}/product/local/admin`);
    setRecords(res.data.data);
    setLoading(false);
  };
  const openProductEditingModal = (productData, type = 'edit') => {
    if (type === 'creation') {
      setEditingProdData({ create: true });
    } else {
      setEditingProdData(productData);
    }
    open();
  };
  const deleteProduct = async (id) => {
    setDeleting(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/product/local`, {
        headers: {
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
        },
        data: { product_id: id },
      });
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title: 'Бараа устгалт',
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchPage();
      } else {
        showNotification({
          title: 'Бараа устгалт',
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      showNotification({
        title: 'Бараа устгалт',
        message: e.message,
        color: 'red',
      });
    }
    setDeleting(false);
    handlers.close();
  };
  const createProduct = async (values) => {
    setUpdating(true);
    const title = 'Бараа үүсгэлт';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/product/local`,
        {
          name: values.name,
          description: values.description,
          main_cat_id: values.main_cat_id ? values.main_cat_id : [],
          parent_cat_id: values.parent_cat_id ? values.parent_cat_id : [],
          child_cat_id: values.child_cat_id ? values.child_cat_id : [],
          packaging: values.packaging,
          instock: values.instock,
          price: values.price,
          instruction: values.instruction,
          detailed_description: values.detailed_description,
          note: values.note,
          promo_price: values.promo_price,
          wholesale_price: values.wholesale_price,
          wholesale_qty: values.wholesale_qty,
          images: [
            'https://wp.dailybruin.com/images/2018/10/web.ae_.trench.review.courtesy.jpg',
            'https://www.seekpng.com/png/detail/417-4172893_transparent-twenty-one-pilots-self-titled-album-cover.png',
          ],
        },

        {
          headers: {
            Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
          },
        }
      );
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchPage();
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
  const updateProduct = async (values) => {
    setUpdating(true);
    const title = 'Барааны мэдээлэл шинэчлэлт';
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/product/local`,
        {
          product_id: values.id,
          name: values.name,
          description: values.description,
          main_cat_id: values.main_cat_id ? values.main_cat_id : [],
          parent_cat_id: values.parent_cat_id ? values.parent_cat_id : [],
          child_cat_id: values.child_cat_id ? values.child_cat_id : [],
          packaging: values.packaging,
          instock: values.instock,
          price: values.price,
          instruction: values.instruction,
          detailed_description: values.detailed_description,
          note: values.note,
          promo_price: values.promo_price,
          wholesale_price: values.wholesale_price,
          wholesale_qty: values.wholesale_qty,
          images: [
            'https://wp.dailybruin.com/images/2018/10/web.ae_.trench.review.courtesy.jpg',
            'https://www.seekpng.com/png/detail/417-4172893_transparent-twenty-one-pilots-self-titled-album-cover.png',
          ],
        },

        {
          headers: {
            Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
          },
        }
      );
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchPage();
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
  const openDeleteConfirmation = (productId, productName) => {
    setDeletingProduct({ id: productId, name: productName });
    handlers.open();
  };

  const uploadFormData = async ({ file, images }) => {
    const title = 'Бараа бүртгэл (Excel)';
    setUploading(true);
    const formData = new FormData();
    formData.append('excel', file);
    formData.append('img', images);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/product/excel?excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
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
    setUploading(false);
  };
  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <DeleteConfirmationDialog
          isOpen={confirmationOpened}
          close={handlers.close}
          confirmationText="Барааг идэвхигүй болгох уу?"
          thingToDelete={deletingProduct}
          onConfirm={deleteProduct}
          loading={deleting}
        />
        <ProductModal
          initialData={editingProdData}
          isOpen={opened}
          close={close}
          loading={updating}
          onSubmit={editingProdData?.create ? createProduct : updateProduct}
          categories={{ mainCategories: [], parentCategories: [], childCategories: [] }}
        />
        <ExcelUploader
          isOpen={excelUploaderOpened}
          close={closeExcelUploader}
          loading={uploading}
          onSubmit={uploadFormData}
        />
        <Grid position="apart" grow>
          <Grid.Col span={2}>
            <Text size="lg" weight={500}>
              Бараанууд
            </Text>
          </Grid.Col>
          <Grid.Col span={4} offset={3}>
            <TextInput
              placeholder="Бараа хайх... (Нэр)"
              rightSection={<IconSearch size="1rem" />}
              radius="xl"
              styles={{ root: { flexGrow: 2 } }}
              onChange={(e) => {
                e.preventDefault();
                setQuery(e.currentTarget.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Group position="center">
              <Button
                variant="filled"
                radius="xl"
                styles={{ label: { padding: 12 } }}
                onClick={(e) => {
                  e.preventDefault();
                  openProductEditingModal({}, 'creation');
                }}
              >
                Бараа Үүсгэх
              </Button>
              <Tooltip label="Excel файлаар бараа оруулах" withArrow>
                <ActionIcon
                  onClick={(e) => {
                    e.preventDefault();
                    openExcelUploader();
                  }}
                >
                  <IconExcel style={{ fontSize: '2em' }} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Grid.Col>
        </Grid>

        <DataTable
          height="75vh"
          minHeight="75vh"
          mt="lg"
          fontSize="xs"
          borderRadius="sm"
          withBorder
          withColumnBorders
          highlightOnHover
          records={records}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          fetching={loading}
          page={page}
          onPageChange={(p) => setPage(p)}
          totalRecords={total}
          recordsPerPage={PAGE_SIZE}
          noRecordsText="Бараа олдсонгүй"
          rowExpansion={{
            content: ({ record }) => (
              <ProductDetails
                initialData={record}
                categories={{ mainCategories: [], parentCategories: [], childCategories: [] }}
              />
            ),
          }}
          columns={[
            {
              accessor: 'product_image',
              title: 'Зураг',
              width: 100,
              render: ({ product_image }) =>
                product_image ? (
                  <Center>
                    <Image
                      src={`http://${product_image?.images[0]}`}
                      alt="Зураг"
                      style={{ objectFit: 'contain' }}
                      height={60}
                      width={60}
                    />
                  </Center>
                ) : (
                  <Center>
                    <IconPhotoOff color="gray" />
                  </Center>
                ),
            },
            {
              accessor: 'name',
              title: 'Нэр',
              width: 200,
              render: (r) => <Text weight={500}>{r.name}</Text>,
            },

            {
              accessor: 'instock',
              title: 'Үлдэгдэл',
              textAlignment: 'center',
              width: 85,
              render: (r) => (
                <Text>
                  {r.instock ? r.instock : 0} {r.unit}
                </Text>
              ),
            },
            {
              accessor: 'price',
              title: 'Нэгж үнэ (₮)',
              textAlignment: 'center',
              width: 95,
              render: ({ price }) => <Text>{Intl.NumberFormat().format(price)}</Text>,
            },

            { accessor: 'note', title: 'Тэмдэглэл' },

            {
              accessor: 'description',
              title: 'Тайлбар',
              render: ({ description }) => <Text lineClamp={5}>{description}</Text>,
            },
            {
              accessor: 'detailed_description',
              title: 'Дэлгэрэнгүй тайлбар',
              render: ({ detailed_description }) => (
                <Text lineClamp={5}>{detailed_description}</Text>
              ),
            },
            {
              accessor: 'active',
              title: 'Идэвхитэй эсэх',
              width: 130,
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
              accessor: 'actions',
              title: <Text>Үйлдэл</Text>,
              textAlignment: 'center',
              width: 80,
              render: (record) => (
                <Group spacing={4} noWrap>
                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductEditingModal(record);
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
      </Container>
    </DefaultLayout>
  );
}
export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/product/local/admin`, {
    headers: {
      Authorization: `Bearer ${req.cookies.urga_admin_user_jwt}`,
    },
  });
  // const mainCats = await axios.get(`${process.env.NEXT_PUBLIC_API}/admin/category/main`, {
  //   headers: {
  //     Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
  //   },
  // });
  // const parentCats = await axios.get(`${process.env.NEXT_PUBLIC_API}/admin/category/parent`, {
  //   headers: {
  //     Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
  //   },
  // });
  // const childCats = await axios.get(`${process.env.NEXT_PUBLIC_API}/admin/category/child`, {
  //   headers: {
  //     Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
  //   },
  // });

  return {
    props: {
      products: response.data.data,
      // mainCategories: mainCats.data.data,
      // parentCategories: parentCats.data.data,
      // childCategories: childCats.data.data,
      total: response.data.total,
    },
  };
});

export default Product;
