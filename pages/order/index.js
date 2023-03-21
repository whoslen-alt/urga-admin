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
  CopyButton,
  Tooltip,
  Popover,
  Input,
  Select,
  Indicator,
  Radio,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect, useMemo } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import {
  IconBox,
  IconCalendar,
  IconCalendarStats,
  IconCalendarTime,
  IconCheck,
  IconCopy,
  IconEdit,
  IconEye,
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
import { DatesProvider, DatePickerInput, Calendar } from '@mantine/dates';
import 'dayjs/locale/mn';
import dayjs from 'dayjs';
import OrderProductsDetail from '../../components/OrderProductsDetail/OrderProductsDetail';
import { orderStatus } from '../../lib/constants/order_status';
import { isNotEmpty, useForm } from '@mantine/form';

const PAGE_SIZE = 15;
const dateFormat = 'YYYY-MM-DD';

function Order({ orders, total }) {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [popovers, setPopovers] = useState(
    orders.map((e) => {
      return {
        id: e.orderid,
        isOpen: false,
      };
    })
  );
  const [confirmationOpened, handlers] = useDisclosure(false);
  const [dates, setDates] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [expandedRecordIds, setExpandedRecordIds] = useState([]);
  const orderStatuses = useMemo(() => orderStatus, []);
  const form = useForm({
    initialValues: {
      orderStatus: '',
    },
    validate: {
      orderStatus: isNotEmpty('Төлөв сонгоно уу'),
    },
  });
  useEffect(() => {
    setRecords(orders);
  }, []);
  useEffect(() => {
    // setDates(dates);
    fetchPage();
  }, [dates]);

  const updateOrderStatus = async (orderId, initialStatus, orderStatus) => {
    const title = 'Захиалгын төлөв шинэчлэлт';
    if (initialStatus.toString() === orderStatus) {
      return;
    }
    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/order/local`,
        { status: orderStatus, orderid: orderId },
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

        await fetchPage();

        const currentPopovers = [...popovers];
        const updatedOrderPopover = currentPopovers.find((element) => element.id === orderId);
        updatedOrderPopover.isOpen = false;
        setPopovers(currentPopovers);
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
  const fetchPage = async () => {
    setLoading(true);
    const initialDates = [dates[0], dates[1]];
    const res = await axios.get(
      // `${process.env.NEXT_PUBLIC_API}/admin/order/local?fromDate=${initialDates[0].format(
      //   dateFormat
      // )}&untilDate=${initialDates[1].format(dateFormat)}`,
      `${process.env.NEXT_PUBLIC_API}/admin/order/local?fromDate=2022-12-30&untilDate=${dayjs(
        initialDates[1]
      ).format(dateFormat)}`,
      {
        headers: {
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxYWVmYmM4ZDZhMGY2ODc3YjJiMjU2YWIwODEwY2VjMDdlZGM0YzdkOGE4NTFhY2U3MDQ2NjdlZjQyMjc1NGFkIiwicm9sZWlkIjoxMDAsImlhdCI6MTY3OTI0MTc3NCwiZXhwIjoxNjc5ODQ2NTc0fQ.LijO3-6xPvDAhyeW73oh5ecuAWVhz9gytwBFLvm6UXY'}`,
        },
      }
    );
    setRecords(res.data.data);
    setLoading(false);
  };

  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <DeleteConfirmationDialog
          isOpen={confirmationOpened}
          close={handlers.close}
          confirmationText="Захиалгыг идэвхигүй болгох уу?"
          // productData={deletingProduct}
          // onConfirm={deleteProduct}
          loading={deleting}
        />
        <Grid columns={24} position="apart" grow>
          <Grid.Col span={8}>
            <Text size="lg" weight={500}>
              Захиалгууд
            </Text>
          </Grid.Col>
          <Grid.Col span={1}>
            <DatesProvider settings={{ locale: 'mn', firstDayOfWeek: 0, weekendDays: [0] }}>
              <DatePickerInput
                icon={<IconCalendarTime size={16} stroke={1.5} />}
                type="range"
                styles={(theme) => ({
                  icon: {
                    color: theme.colorScheme === 'dark' ? 'white' : 'black',
                  },
                  input: {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 13,
                  },
                })}
                placeholder="Захиалгын огноог сонгоно уу"
                radius="xl"
                valueFormat="YYYY-MM-DD"
                value={dates}
                onChange={setDates}
                labelSeparator="→"
              />
            </DatesProvider>
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              placeholder="Захиалга хайх"
              rightSection={<IconSearch size="1rem" />}
              radius="xl"
              styles={{ root: { flexGrow: 2 } }}
            />
          </Grid.Col>
        </Grid>

        <Box sx={{ height: 400 }}>
          <DataTable
            mt="lg"
            fontSize="xs"
            borderRadius="sm"
            withBorder
            withColumnBorders
            highlightOnHover
            records={records}
            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={setSelectedRecords}
            totalRecords={total}
            recordsPerPage={PAGE_SIZE}
            page={page}
            fetching={loading}
            // onPageChange={(p) => fetchPage(p)}
            idAccessor="orderid"
            rowExpansion={{
              trigger: 'never',
              expanded: {
                recordIds: expandedRecordIds,
              },
              content: ({ record }) => {
                return <OrderProductsDetail products={record.order_items} />;
              },
            }}
            columns={[
              {
                accessor: 'orderid',
                title: 'Захиалгын дугаар',
                width: 160,
                render: ({ orderid }) => (
                  <Flex justify="space-between" align="center" px={5} gap={2}>
                    <Text># {orderid}</Text>
                    <CopyButton value={orderid} timeout={2000}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? 'Хуулагдлаа' : 'Хуулах'}
                          withArrow
                          position="right"
                        >
                          <ActionIcon
                            color={copied ? 'teal' : 'gray'}
                            onClick={(e) => {
                              e.stopPropagation();
                              copy();
                            }}
                          >
                            {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Flex>
                ),
              },

              {
                accessor: 'full_name',
                title: 'Захиалагч',
                width: 200,
                render: ({ user }) => (
                  <>
                    <Text weight={500}>{user?.family_name}</Text>
                    <Text weight={500}>{user?.given_name}</Text>
                  </>
                ),
              },
              {
                accessor: 'user.mobile',
                title: 'Холбогдох утас',
                width: 120,
              },
              {
                accessor: 'address',
                title: 'Хүлээн авах байршил',
              },
              {
                accessor: 'total',
                title: 'Захиалгын дүн',
                textAlignment: 'center',
                width: 150,
                render: ({ total }) => (
                  <Text>
                    {Intl.NumberFormat('mn', {
                      style: 'currency',
                      currency: 'MNT',
                      currencyDisplay: 'narrowSymbol',
                    }).format(total)}
                  </Text>
                ),
              },
              { accessor: 'note', title: 'Тэмдэглэл' },
              {
                accessor: 'status',
                title: 'Төлөв',
                render: ({ status }) => (
                  <Badge color={orderStatuses[status].color}> {orderStatuses[status].status}</Badge>
                ),
              },
              {
                accessor: 'createdAt',
                title: 'Үүсгэсэн огноо',
                textAlignment: 'center',
                sortable: true,
                width: 150,
                render: ({ createdAt }) => (
                  <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
                ),
              },
              {
                accessor: 'actions',
                title: <Text>Үйлдэл</Text>,
                textAlignment: 'center',
                render: ({ status, orderid }) => (
                  <Group position="center" spacing={4} noWrap>
                    <Tooltip label="Захиалсан бараа харах" withArrow>
                      <ActionIcon
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          expandedRecordIds.length > 0
                            ? setExpandedRecordIds([])
                            : setExpandedRecordIds([orderid]);
                        }}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Popover
                      opened={popovers.find((e) => e.id === orderid).isOpen}
                      onChange={(opened) => {
                        const currentPopovers = [...popovers];
                        const targetPopover = currentPopovers.find(
                          (element) => element.id === orderid
                        );
                        targetPopover.isOpen = opened;
                        setPopovers(currentPopovers);
                      }}
                      position="bottom"
                      withArrow
                      shadow="md"
                      onOpen={() => {
                        form.setFieldValue(
                          'orderStatus',
                          status === 201 || status === 301 ? status.toString() : ''
                        );
                      }}
                    >
                      <Popover.Target>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentPopovers = [...popovers];
                            const targetPopover = currentPopovers.find(
                              (element) => element.id === orderid
                            );
                            targetPopover.isOpen = !targetPopover.isOpen;
                            setPopovers(currentPopovers);
                          }}
                        >
                          Төлөв солих
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <form
                          onSubmit={form.onSubmit(({ orderStatus }) =>
                            updateOrderStatus(orderid, status, orderStatus)
                          )}
                        >
                          <Stack spacing="md">
                            <Radio.Group
                              name="orderStatus"
                              size="xs"
                              {...form.getInputProps('orderStatus')}
                            >
                              <Stack mt="xs">
                                {Object.keys(orderStatuses)
                                  .filter((e) => e === '201' || e === '301')
                                  .map((e, i) => {
                                    return (
                                      <Radio
                                        key={`order-status-radio-${i}`}
                                        value={e}
                                        label={orderStatuses[e].status}
                                        size="xs"
                                      />
                                    );
                                  })}
                              </Stack>
                            </Radio.Group>
                            <Flex justify="flex-end">
                              <Button size="xs" loading={updating} type="submit">
                                ОК
                              </Button>
                            </Flex>
                          </Stack>
                        </form>
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                ),
              },
            ]}
          />
        </Box>
      </Container>
    </DefaultLayout>
  );
}
export async function getServerSideProps() {
  const dateFormat = 'YYYY-MM-DD';
  const initialDates = [dayjs().subtract(7, 'days'), dayjs()];
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/admin/order/local?fromDate=${initialDates[0].format(
      dateFormat
    )}&untilDate=${initialDates[1].format(dateFormat)}`,
    {
      headers: {
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxYWVmYmM4ZDZhMGY2ODc3YjJiMjU2YWIwODEwY2VjMDdlZGM0YzdkOGE4NTFhY2U3MDQ2NjdlZjQyMjc1NGFkIiwicm9sZWlkIjoxMDAsImlhdCI6MTY3OTI0MTc3NCwiZXhwIjoxNjc5ODQ2NTc0fQ.LijO3-6xPvDAhyeW73oh5ecuAWVhz9gytwBFLvm6UXY'}`,
      },
    }
  );
  return {
    props: {
      orders: res.data.data,
      // total: res.data.total,
      total: res.data.data.length,
    },
  };
}

export default Order;
