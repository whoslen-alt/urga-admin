import {
  Container,
  Box,
  Badge,
  Text,
  Group,
  ActionIcon,
  Stack,
  TextInput,
  Button,
  Flex,
  Grid,
  CopyButton,
  Tooltip,
  Popover,
  Radio,
  NativeSelect,
  Select,
  Textarea,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect, useMemo } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import {
  IconCalendarTime,
  IconCheck,
  IconCopy,
  IconEye,
  IconFilter,
  IconSearch,
} from '@tabler/icons';
import axios from 'axios';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { showNotification } from '@mantine/notifications';
import { DatesProvider, DatePickerInput, Calendar } from '@mantine/dates';
import 'dayjs/locale/mn';
import dayjs from 'dayjs';
import OrderProductsDetail from '../../components/OrderProductsDetail/OrderProductsDetail';
import { invoiceStatus } from '../../lib/constants/invoice_status';
import { isNotEmpty, useForm } from '@mantine/form';
import requireAuthentication from '../../lib/requireAuthentication';
import RefundDetail from '../../components/RefundDetail/RefundDetail';
import { useInvoices } from '../../hooks/useInvoices';
import { IconFileInvoice } from '@tabler/icons-react';
import InvoicePreview from '../../components/InvoicePreview/InvoicePreview';

const PAGE_SIZE = 15;
const dateFormat = 'YYYY-MM-DD';

function Invoice({ userToken }) {
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [query, setQuery] = useState('');
  const [keys, setKeys] = useState('');
  const [debounced] = useDebouncedValue(query, 500);
  const [popovers, setPopovers] = useState([]);
  const [invoicePrevOpened, { open: openInvoicePreview, close: closeInvoicePreview }] =
    useDisclosure(false);
  const [dates, setDates] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [orderFilterValue, setOrderFilterValue] = useState('all');
  const [expandedRecordIds, setExpandedRecordIds] = useState([]);
  const { data, isLoading } = useInvoices(
    {
      status: orderFilterValue === 'all' ? '' : orderFilterValue,
      fromDate: dayjs(dates?.[0]).format(dateFormat),
      untilDate: dayjs(dates?.[1]).format(dateFormat),
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      keys,
    },
    userToken
  );

  const invoiceStatuses = useMemo(() => invoiceStatus, []);

  const form = useForm({
    initialValues: {
      status: '',
    },
    validate: {
      status: isNotEmpty('Төлөв сонгоно уу'),
    },
  });

  const updateInvoiceStatus = async (id, status) => {
    const title = 'Хүсэлтийн хариу';

    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/order/invoice`,
        {
          invoice_id: id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
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

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <InvoicePreview
        isOpen={invoicePrevOpened}
        orderId={currentOrderId}
        userToken={userToken}
        close={closeInvoicePreview}
      />
      <Grid columns={24} position="apart" grow>
        <Grid.Col span={8} md={4}>
          <Text size="lg" weight={500}>
            Нэхэмжлэлүүд
          </Text>
        </Grid.Col>
        {/* <Grid.Col md={8} lg={1} xl={1} sm={4} xs={24}>
          <DatesProvider settings={{ locale: 'mn', firstDayOfWeek: 0, weekendDays: [0] }}>
            <DatePickerInput
              allowSingleDateInRange
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
              placeholder="Огноо сонгоно уу"
              radius="xl"
              valueFormat="YYYY-MM-DD"
              value={dates}
              onChange={(value) => {
                setDates(value);
                setPage(1);
              }}
              labelSeparator="→"
            />
          </DatesProvider>
        </Grid.Col> */}
        {/* <Grid.Col span={6} sm={6} xs={24}>
            <TextInput
              placeholder="Захиалгын дугаараар хайх"
              // , Захиалагч, Холбогдох утас
              rightSection={<IconSearch size="1rem" />}
              radius="xl"
              styles={{ root: { flexGrow: 2 } }}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
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
        fetching={isLoading}
        records={data?.invoice}
        page={page}
        onPageChange={setPage}
        totalRecords={data?.meta?.total}
        recordsPerPage={PAGE_SIZE}
        idAccessor="id"
        noRecordsText="Нэхэмжлэл олдсонгүй"
        rowExpansion={{
          trigger: 'never',
          expanded: {
            recordIds: expandedRecordIds,
          },
          content: ({ record }) => {
            return <OrderProductsDetail products={record?.order?.order_item} />;
          },
        }}
        pinLastColumn
        columns={[
          {
            accessor: 'orderid',
            title: 'Захиалгын дугаар',
            width: '0%',
            render: ({ orderid }) => (
              <Flex justify="space-between" align="center" px={5} gap={2}>
                <Text># {orderid}</Text>
                <CopyButton value={orderid} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Хуулагдлаа' : 'Хуулах'} withArrow position="right">
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
            accessor: 'company',
            title: 'Компани',
            width: '0%',
          },
          {
            accessor: 'contact',
            title: 'Холбогдох мэдээлэл',
            width: '0%',
          },
          {
            accessor: 'status',
            title: 'Төлөв',
            // (
            //   <Group position="center">
            //     <Text>Төлөв</Text>
            //     <Popover position="bottom" withArrow shadow="md">
            //       <Popover.Target>
            //         <ActionIcon radius="xl">
            //           <IconFilter size="1.125rem" />
            //         </ActionIcon>
            //       </Popover.Target>
            //       <Popover.Dropdown>
            //         <Radio.Group
            //           value={orderFilterValue}
            //           onChange={(value) => {
            //             setOrderFilterValue(value);
            //             setPage(1);
            //           }}
            //         >
            //           <Stack>
            //             <Radio value="all" label="Бүгд" size="xs" />
            //             {Object.keys(orderStatuses).map((e, i) => {
            //               return (
            //                 <Radio
            //                   key={`order-status-filter-radio-${i}`}
            //                   value={e}
            //                   label={orderStatuses[e].status}
            //                   size="xs"
            //                 />
            //               );
            //             })}
            //           </Stack>
            //         </Radio.Group>
            //       </Popover.Dropdown>
            //     </Popover>
            //   </Group>
            // ),
            width: '0%',
            render: ({ status }) => (
              <Badge color={invoiceStatuses[status]?.color}>
                {' '}
                {invoiceStatuses[status]?.status}
              </Badge>
            ),
          },
          {
            accessor: 'createdAt',
            title: 'Үүсгэсэн огноо',
            textAlignment: 'center',
            width: '0%',
            render: ({ createdAt }) => (
              <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
            ),
          },
          {
            accessor: 'actions',
            title: <Text>Үйлдэл</Text>,
            textAlignment: 'center',
            width: '0%',
            render: ({ id, orderid }) => (
              <Group position="center" spacing={4} noWrap>
                <Tooltip label="Нэхэмжлэл харах" withArrow position="bottom" withinPortal>
                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentOrderId(orderid);
                      openInvoicePreview();
                    }}
                  >
                    <IconFileInvoice size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  label="Захиалгын дэлгэрэнгүйг харах"
                  withArrow
                  position="bottom"
                  withinPortal
                >
                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (expandedRecordIds.length > 0) {
                        expandedRecordIds[0] === id
                          ? setExpandedRecordIds([])
                          : setExpandedRecordIds([id]);
                      } else {
                        setExpandedRecordIds([id]);
                      }
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                </Tooltip>

                <Popover position="bottom" withinPortal withArrow shadow="md">
                  <Popover.Target>
                    <Button variant="subtle" size="xs">
                      Хариу өгөх
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <form
                      onSubmit={form.onSubmit(async ({ status }) => {
                        await updateInvoiceStatus(id, status);
                      })}
                    >
                      <Stack spacing="md">
                        <Select
                          label="Нэхэмжлэлийн төлөв"
                          placeholder="Шийдвэрлэх төлөв сонгоно уу"
                          size="xs"
                          data={Object.keys(invoiceStatuses).map((e, i) => {
                            return {
                              value: e,
                              label: invoiceStatuses[e].status,
                            };
                          })}
                          {...form.getInputProps('status')}
                        />

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
    </Container>
  );
}

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  return {
    props: {
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default Invoice;
