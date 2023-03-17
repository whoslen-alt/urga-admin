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
  Center,
  TextInput,
  Button,
  Menu,
  Flex,
  Col,
  Grid,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import {
  IconBox,
  IconCalendar,
  IconCalendarTime,
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
import axios from 'axios';
import ProductDetails from '../../components/ProductDetails/ProductDetails';
import { useColorScheme, useDisclosure } from '@mantine/hooks';
import ProductModal from '../../components/ProductModal/ProductModal';
import Image from 'next/image';
import { modals } from '@mantine/modals';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { showNotification } from '@mantine/notifications';
import { DatesProvider, DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/mn';
import dayjs from 'dayjs';

const PAGE_SIZE = 15;

function Order({ orders, total }) {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmationOpened, handlers] = useDisclosure(false);
  const [dates, setDates] = useState();
  useEffect(() => {
    setDates([dayjs().subtract(7, 'days'), dayjs()]);
    setRecords(orders);
  }, []);
  useEffect(() => {
    // setDates(dates);
  }, []);

  // const fetchPage = async (pageNumber) => {
  //   setLoading(true);
  //   const offset = pageNumber * PAGE_SIZE;
  //   const res = await axios(
  //     `${process.env.NEXT_PUBLIC_API}/product/local/admin?offset=${offset}&limit=${PAGE_SIZE}`
  //   );
  //   setRecords(res.data.data);
  //   setPage(pageNumber);
  //   setLoading(false);
  // };
  // const openProductEditingModal = (productData, type = 'edit') => {
  //   if (type === 'creation') {
  //     setEditingProdData({ create: true });
  //   } else {
  //     setEditingProdData(productData);
  //   }
  //   open();
  // };
  // const deleteProduct = async (id) => {
  //   setDeleting(true);
  //   try {
  //     const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/product/local`, {
  //       headers: {
  //         Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
  //       },
  //       data: { product_id: id },
  //     });
  //     if (res.status === 200) {
  //       showNotification({
  //         title: 'Бараа устгалт',
  //         message: res.data.message,
  //         color: 'green',
  //         icon: <IconCheck />,
  //       });
  //       await fetchPage(page);
  //     } else {
  //       showNotification({
  //         title: 'Бараа устгалт',
  //         message: res.data.message,
  //         color: 'red',
  //       });
  //     }
  //   } catch (e) {
  //     showNotification({
  //       title: 'Бараа устгалт',
  //       message: e.message,
  //       color: 'red',
  //     });
  //   }
  //   setDeleting(false);
  //   handlers.close();
  // };
  // const createProduct = async (values) => {
  //   setUpdating(true);
  //   const title = 'Бараа үүсгэлт';
  //   try {
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API}/admin/product/local`,
  //       {
  //         name: values.name,
  //         description: values.description,
  //         main_cat_id: values.main_cat_id ? values.main_cat_id : [],
  //         parent_cat_id: values.parent_cat_id ? values.parent_cat_id : [],
  //         child_cat_id: values.child_cat_id ? values.child_cat_id : [],
  //         packaging: values.packaging,
  //         instock: values.instock,
  //         price: values.price,
  //         instruction: values.instruction,
  //         detailed_description: values.detailed_description,
  //         note: values.note,
  //         promo_price: values.promo_price,
  //         wholesale_price: values.wholesale_price,
  //         wholesale_qty: values.wholesale_qty,
  //         images: [
  //           'https://wp.dailybruin.com/images/2018/10/web.ae_.trench.review.courtesy.jpg',
  //           'https://www.seekpng.com/png/detail/417-4172893_transparent-twenty-one-pilots-self-titled-album-cover.png',
  //         ],
  //       },

  //       {
  //         headers: {
  //           Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
  //         },
  //       }
  //     );
  //     if (res.status === 200) {
  //       showNotification({
  //         title,
  //         message: res.data.message,
  //         color: 'green',
  //         icon: <IconCheck />,
  //       });
  //       await fetchPage(page);
  //     } else {
  //       showNotification({
  //         title,
  //         message: res.data.message,
  //         color: 'red',
  //       });
  //     }
  //   } catch (e) {
  //     showNotification({
  //       title,
  //       message: e.message,
  //       color: 'red',
  //     });
  //   }
  //   setUpdating(false);
  // };
  // const updateProduct = async (values) => {
  //   setUpdating(true);
  //   const title = 'Барааны мэдээлэл шинэчлэлт';
  //   try {
  //     const res = await axios.put(
  //       `${process.env.NEXT_PUBLIC_API}/admin/product/local`,
  //       {
  //         product_id: values.id,
  //         name: values.name,
  //         description: values.description,
  //         main_cat_id: values.main_cat_id ? values.main_cat_id : [],
  //         parent_cat_id: values.parent_cat_id ? values.parent_cat_id : [],
  //         child_cat_id: values.child_cat_id ? values.child_cat_id : [],
  //         packaging: values.packaging,
  //         instock: values.instock,
  //         price: values.price,
  //         instruction: values.instruction,
  //         detailed_description: values.detailed_description,
  //         note: values.note,
  //         promo_price: values.promo_price,
  //         wholesale_price: values.wholesale_price,
  //         wholesale_qty: values.wholesale_qty,
  //         images: [
  //           'https://wp.dailybruin.com/images/2018/10/web.ae_.trench.review.courtesy.jpg',
  //           'https://www.seekpng.com/png/detail/417-4172893_transparent-twenty-one-pilots-self-titled-album-cover.png',
  //         ],
  //       },

  //       {
  //         headers: {
  //           Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
  //         },
  //       }
  //     );
  //     if (res.status === 200) {
  //       showNotification({
  //         title,
  //         message: res.data.message,
  //         color: 'green',
  //         icon: <IconCheck />,
  //       });
  //       await fetchPage(page);
  //     } else {
  //       showNotification({
  //         title,
  //         message: res.data.message,
  //         color: 'red',
  //       });
  //     }
  //   } catch (e) {
  //     showNotification({
  //       title,
  //       message: e.message,
  //       color: 'red',
  //     });
  //   }
  //   setUpdating(false);
  // };
  // const openDeleteConfirmation = (productId, productName) => {
  //   handlers.open();
  // };

  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <DeleteConfirmationDialog
          isOpen={confirmationOpened}
          close={handlers.close}
          confirmationText="Барааг идэвхигүй болгох уу?"
          // productData={deletingProduct}
          // onConfirm={deleteProduct}
          loading={deleting}
        />
        <Grid position="apart" grow>
          <Grid.Col span={4}>
            <Text size="lg" weight={500}>
              Захиалгууд
            </Text>
          </Grid.Col>

          <Grid.Col span={2}>
            <DatesProvider settings={{ locale: 'mn', firstDayOfWeek: 0, weekendDays: [0] }}>
              <DatePickerInput
                maw={300}
                icon={
                  <Box
                    sx={(theme) => ({
                      paddingTop: 4,
                      color: theme.colorScheme === 'dark' ? 'white' : 'black',
                    })}
                  >
                    <IconCalendarTime size="1.1rem" stroke={1.5} />
                  </Box>
                }
                type="range"
                placeholder="Захиалгын огноог сонгоно уу"
                radius="xl"
                valueFormat="YYYY-MM-DD"
                value={dates}
                onChange={setDates}
                labelSeparator="→"
              />
            </DatesProvider>
          </Grid.Col>
          <Grid.Col span={4}>
            <TextInput
              placeholder="Захиалга хайх"
              rightSection={<IconSearch size="1rem" />}
              radius="xl"
              styles={{ root: { flexGrow: 2 } }}
            />
          </Grid.Col>
        </Grid>

        <Box sx={{ height: '100%' }}>
          {/* <DataTable
            // mt="lg"
            // fontSize="xs"
            // borderRadius="sm"
            // withBorder
            // withColumnBorders
            // highlightOnHover
            // records={records}
            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={setSelectedRecords}
            // totalRecords={total}
            // recordsPerPage={PAGE_SIZE}
            // page={page}
            // fetching={loading}
            // onPageChange={(p) => fetchPage(p)}
            // rowExpansion={{
            //   content: ({ record }) => (
            //     <ProductDetails
            //       initialData={record}
            //       categories={{ mainCategories, parentCategories, childCategories }}
            //     />
            //   ),
            // }}
            // columns={[
            //   {
            //     accessor: 'product_image',
            //     title: 'Зураг',
            //     width: 100,
            //     render: (r) =>
            //       r.product_image ? (
            //         <Image src={r.product_image} alt="Зураг" height={100} width={100} />
            //       ) : (
            //         <Center>
            //           <IconPhotoOff color="gray" />
            //         </Center>
            //       ),
            //   },
            //   {
            //     accessor: 'name',
            //     title: 'Нэр',
            //     width: 200,
            //     render: (r) => <Text weight={500}>{r.name}</Text>,
            //   },

            //   {
            //     accessor: 'instock',
            //     title: 'Үлдэгдэл',
            //     textAlignment: 'center',
            //     width: 85,
            //     render: (r) => (
            //       <Text>
            //         {r.instock} {r.unit}
            //       </Text>
            //     ),
            //   },
            //   {
            //     accessor: 'price',
            //     title: 'Нэгж үнэ (₮)',
            //     textAlignment: 'center',
            //     width: 95,
            //     // render: (r) => <Text>{Intl.NumberFormat().formatToParts(r.price)}</Text>,
            //   },

            //   { accessor: 'note', title: 'Тэмдэглэл' },

            //   { accessor: 'description', title: 'Тайлбар' },
            //   { accessor: 'detailed_description', title: 'Дэлгэрэнгүй тайлбар' },
            //   {
            //     accessor: 'active',
            //     title: 'Идэвхитэй эсэх',
            //     width: 130,
            //     textAlignment: 'center',
            //     render: (record) => (
            //       <Badge
            //         color={record.active ? 'green' : 'red'}
            //         size="sm"
            //         variant="filled"
            //         styles={{
            //           inner: {
            //             textTransform: 'capitalize',
            //             fontWeight: 500,
            //           },
            //           root: {
            //             padding: '8px 8px 9px 8px',
            //           },
            //         }}
            //       >
            //         {record.active ? 'Идэвхитэй' : 'Идэвхигүй'}
            //       </Badge>
            //     ),
            //   },
            //   {
            //     accessor: 'actions',
            //     title: <Text>Үйлдэл</Text>,
            //     textAlignment: 'center',
            //     width: 80,
            //     render: (record) => (
            //       <Group spacing={4} noWrap>
            //         <ActionIcon
            //           color="blue"
            //           onClick={(e) => {
            //             e.stopPropagation();
            //             openProductEditingModal(record);
            //             // editInfo(company);
            //           }}
            //         >
            //           <IconEdit size={16} />
            //         </ActionIcon>
            //         <ActionIcon
            //           color="red"
            //           onClick={(e) => {
            //             e.stopPropagation();
            //             openDeleteConfirmation(record.id, record.name);
            //           }}
            //         >
            //           <IconTrash size={16} />
            //         </ActionIcon>
            //       </Group>
            //     ),
            //   },
            // ]}
          /> */}
        </Box>
      </Container>
    </DefaultLayout>
  );
}
export async function getServerSideProps() {
  const dateFormat = 'YYYY-MM-DD';
  const initialDates = [dayjs().subtract(7, 'days'), dayjs()];
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/admin/order?fromDate=${initialDates[0].format(
      dateFormat
    )}&untilDate=${initialDates[1].format(dateFormat)}`,
    {
      headers: {
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3NTkzNTBlMWYzMmVmODM1ZjRkMDhjYjI5MzllOWZjOThkZDRhMDdhZDFiMzhjMjcyNmE3ZmQxMjBjOWU4NzQ5Iiwicm9sZWlkIjozMywiaWF0IjoxNjc3MzE3MTQ1LCJleHAiOjE2Nzc5MjE5NDV9.rlnMXx48AF25X58C1t2AYCEwHAXlHq1vVsvDb773q2c'}`,
      },
    }
  );
  return {
    props: {
      orders: res.data.data,
      // total: res.data.total,
      total: 50,
    },
  };
}

export default Order;
