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
import { orderStatus } from '../../lib/constants/order_status';
import { isNotEmpty, useForm } from '@mantine/form';
import requireAuthentication from '../../lib/requireAuthentication';
import { useOrders } from '../../hooks/useOrders';

const PAGE_SIZE = 15;
const dateFormat = 'YYYY-MM-DD';

function Order({ userToken }) {
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [keys, setKeys] = useState('');
  const [query, setQuery] = useState('');
  const [debounced] = useDebouncedValue(query, 500);
  const [popovers, setPopovers] = useState([]);
  const [dates, setDates] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [orderFilterValue, setOrderFilterValue] = useState('all');
  const [expandedRecordIds, setExpandedRecordIds] = useState([]);
  const orderStatuses = useMemo(() => orderStatus, []);

  const { data, isLoading } = useOrders(
    {
      status: orderFilterValue === 'all' ? '' : orderFilterValue,
      orderId: debounced.trim(),
      fromDate: dayjs(dates?.[0]).format(dateFormat),
      untilDate: dayjs(dates?.[1]).format(dateFormat),
      limit: PAGE_SIZE,
      offset: page - 1,
      keys,
    },
    userToken
  );

  const form = useForm({
    initialValues: {
      orderStatus: '',
    },
    validate: {
      orderStatus: isNotEmpty('Төлөв сонгоно уу'),
    },
  });

  const updateOrderStatus = async (orderId, initialStatus, orderStatus) => {
    const title = 'Захиалгын төлөв шинэчлэлт';
    const currentPopovers = [...popovers];
    const updatedOrderPopover = currentPopovers.find((element) => element.id === orderId);
    if (updatedOrderPopover) {
      updatedOrderPopover.isOpen = false;
    }
    if (initialStatus?.toString() === orderStatus) {
      setPopovers(currentPopovers);
      return;
    }
    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/order`,
        { status: orderStatus, orderid: orderId },
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

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <Grid columns={24} position="apart" grow>
        <Grid.Col span={8}>
          <Text size="lg" weight={500}>
            Захиалгууд
          </Text>
        </Grid.Col>
        <Grid.Col sm={4} xs={24}>
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
        </Grid.Col>
        <Grid.Col span={6} sm={6} xs={24}>
          <TextInput
            placeholder="Захиалгын дугаараар хайх"
            // , Захиалагч, Холбогдох утас
            rightSection={<IconSearch size="1rem" />}
            radius="xl"
            styles={{ root: { flexGrow: 2 } }}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setPage(1);
            }}
          />
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
        fetching={isLoading}
        records={data?.data}
        page={page}
        onPageChange={setPage}
        totalRecords={data?.pagination?.total}
        recordsPerPage={PAGE_SIZE}
        idAccessor="orderid"
        noRecordsText="Захиалга олдсонгүй"
        rowExpansion={{
          trigger: 'never',
          expanded: {
            recordIds: expandedRecordIds,
          },
          content: ({ record }) => {
            return <OrderProductsDetail products={record.order_items} />;
          },
        }}
        pinLastColumn
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
            accessor: 'full_name',
            title: 'Захиалагч',
            width: 200,
            render: ({ user }) => <Text weight={500}>{user?.given_name || user?.email}</Text>,
          },
          {
            accessor: 'user.mobile',
            title: 'Холбогдох утас',
            width: 120,
          },
          {
            accessor: 'address',
            title: 'Хүлээн авах байршил',
            width: 200,
          },
          {
            accessor: 'total',
            title: 'Захиалгын дүн',
            textAlignment: 'center',
            width: 120,
            render: ({ total }) => {
              return Intl.NumberFormat('mn', {
                style: 'currency',
                currency: 'MNT',
                currencyDisplay: 'narrowSymbol',
              }).format(total);
            },
          },
          { accessor: 'note', title: 'Тэмдэглэл' },
          {
            accessor: 'status',
            title: (
              <Group position="center">
                <Text>Төлөв</Text>
                <Popover position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon radius="xl">
                      <IconFilter size="1.125rem" />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Radio.Group
                      value={orderFilterValue}
                      onChange={(value) => {
                        setOrderFilterValue(value);
                        setPage(1);
                      }}
                    >
                      <Stack>
                        <Radio value="all" label="Бүгд" size="xs" />
                        {Object.keys(orderStatuses).map((e, i) => {
                          return (
                            <Radio
                              key={`order-status-filter-radio-${i}`}
                              value={e}
                              label={orderStatuses[e].status}
                              size="xs"
                            />
                          );
                        })}
                      </Stack>
                    </Radio.Group>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            ),
            render: ({ status }) => (
              <Badge color={orderStatuses[status]?.color}> {orderStatuses[status]?.status}</Badge>
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
                        expandedRecordIds[0] === orderid
                          ? setExpandedRecordIds([])
                          : setExpandedRecordIds([orderid]);
                      } else {
                        setExpandedRecordIds([orderid]);
                      }
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                </Tooltip>
                <Popover
                  withinPortal
                  opened={popovers?.find((e) => e?.id === orderid)?.isOpen}
                  onChange={(opened) => {
                    const currentPopovers = [...popovers];
                    const targetPopover = currentPopovers?.find(
                      (element) => element?.id === orderid
                    );
                    if (targetPopover) {
                      targetPopover.isOpen = opened;
                      setPopovers(currentPopovers);
                    }
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
                        const targetPopover = currentPopovers?.find(
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

export default Order;
