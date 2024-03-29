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
import { useState } from 'react';
import {
  IconBox,
  IconCheck,
  IconEdit,
  IconPackage,
  IconPhoto,
  IconPhotoOff,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconUsers,
  IconX,
} from '@tabler/icons';
// import IconExcel from '~icons/vscode-icons/file-type-excel.jsx';

import axios from 'axios';
import ProductDetails from '../../components/ProductDetails/ProductDetails';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import ProductModal from '../../components/ProductModal/ProductModal';
import Image from 'next/image';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { showNotification } from '@mantine/notifications';
import requireAuthentication from '../../lib/requireAuthentication';
import ExcelUploader from '../../components/ExcelUploader/ExcelUploader';
import { useProducts } from '../../hooks/useProducts';

const PAGE_SIZE = 15;

function Product({ userToken }) {
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [keys, setKeys] = useState('');
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState({ id: '', name: '' });
  const [opened, { open, close }] = useDisclosure(false);
  const [excelUploaderOpened, { open: openExcelUploader, close: closeExcelUploader }] =
    useDisclosure(false);
  const [debounced] = useDebouncedValue(query, 500);
  const { data, isLoading } = useProducts(
    {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      query: debounced,
      keys,
    },
    userToken
  );

  const [confirmationOpened, handlers] = useDisclosure(false);
  const [editingProdData, setEditingProdData] = useState(null);

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
          Authorization: `Bearer ${userToken}`,
        },
        data: { product_id: id },
      });
      if (res.status === 200) {
        showNotification({
          title: 'Бараа устгалт',
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        setKeys(Math.random());
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
          images: values.images,
        },
        config
      );
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        setKeys(Math.random());
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
        `${process.env.NEXT_PUBLIC_API}/admin/product`,
        {
          id: values.id,
          note: values.note,
          description: values.description,
          instruction: values.instruction,
          detailed_description: values.detailed_description,
          deletedImages: values.deletedImages,
          active: values.active,
        },
        config
      );
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        setKeys(Math.random());
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
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userToken}` },
      });
      if (res.status === 200) {
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
  const handleSync = async () => {
    const title = 'ERP sync';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/erp/sync/products`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        setKeys(Math.random());
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
  };
  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <Grid position="apart" grow>
        <Grid.Col span={2}>
          <Text size="lg" weight={500}>
            Бараанууд
          </Text>
        </Grid.Col>
        <Grid.Col span={5} offset={2}>
          <Group>
            <TextInput
              placeholder="Бараа хайх... (Нэр)"
              rightSection={<IconSearch size="1rem" />}
              radius="xl"
              styles={{ root: { flexGrow: 2 } }}
              onChange={(e) => {
                e.preventDefault();
                setQuery(e.currentTarget.value);
                setPage(1);
              }}
            />
            <Button variant="filled" rightIcon={<IconRefresh size="1rem" />} onClick={handleSync}>
              Sync with ERP
            </Button>
          </Group>
        </Grid.Col>
        {/* <Grid.Col span={2}>
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
        </Grid.Col> */}
      </Grid>
      <DataTable
        height="75vh"
        minHeight="75vh"
        mt="lg"
        fontSize="xs"
        borderRadius="sm"
        withBorder
        withColumnBorders
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        records={data?.result}
        fetching={isLoading}
        page={page}
        onPageChange={setPage}
        totalRecords={data?.pagination?.total}
        recordsPerPage={PAGE_SIZE}
        noRecordsText="Бараа олдсонгүй"
        rowExpansion={{
          content: ({ record }) => <ProductDetails initialData={record} />,
        }}
        pinLastColumn
        columns={[
          {
            accessor: 'additionalImage',
            title: 'Зураг',
            width: 100,
            render: ({ additionalImage }) =>
              additionalImage?.[0] ? (
                <Center>
                  <Image
                    src={`${additionalImage?.[0]?.url}`}
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
            accessor: 'balance',
            title: 'Үлдэгдэл',
            textAlignment: 'center',
            width: 85,
          },
          {
            accessor: 'listPrice',
            title: 'Нэгж үнэ (₮)',
            textAlignment: 'center',
            width: 95,
            render: ({ listPrice }) => <Text>{Intl.NumberFormat().format(listPrice)}</Text>,
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
            render: ({ detailed_description }) => <Text lineClamp={5}>{detailed_description}</Text>,
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
            width: '0%',
            render: (record) => (
              <Group spacing={4} noWrap>
                <ActionIcon
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    openProductEditingModal(record);
                  }}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                {/* <ActionIcon
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteConfirmation(record.id, record.name);
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon> */}
              </Group>
            ),
          },
        ]}
      />
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
        userToken={userToken}
        onSubmit={editingProdData?.create ? createProduct : updateProduct}
        // categories={{ mainCategories, parentCategories, childCategories }}
      />
      <ExcelUploader
        isOpen={excelUploaderOpened}
        close={closeExcelUploader}
        loading={uploading}
        onSubmit={uploadFormData}
      />
    </Container>
  );
}
export const getServerSideProps = requireAuthentication(async ({ req }) => {
  return {
    props: {
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default Product;
