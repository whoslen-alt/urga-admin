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
import { refundStatus } from '../../lib/constants/refund_status';
import { isNotEmpty, useForm } from '@mantine/form';
import requireAuthentication from '../../lib/requireAuthentication';
import RefundDetail from '../../components/RefundDetail/RefundDetail';
import { useInvoices } from '../../hooks/useInvoices';

const PAGE_SIZE = 15;
const dateFormat = 'YYYY-MM-DD';

function Invoice({ userToken }) {
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced] = useDebouncedValue(query, 500);
  const [popovers, setPopovers] = useState([]);
  const [dates, setDates] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [orderFilterValue, setOrderFilterValue] = useState('all');
  const [expandedRecordIds, setExpandedRecordIds] = useState([]);
  const { data, isLoading, refetch } = useInvoices(
    {
      status: orderFilterValue === 'all' ? '' : orderFilterValue,
      fromDate: dayjs(dates?.[0]).format(dateFormat),
      untilDate: dayjs(dates?.[1]).format(dateFormat),
      limit: PAGE_SIZE,
      offset: page - 1,
    },
    userToken
  );

  const orderStatuses = useMemo(() => refundStatus, []);
  const form = useForm({
    initialValues: {
      status: '',
      note: '',
    },
    validate: {
      status: isNotEmpty('Төлөв сонгоно уу'),
      note: isNotEmpty('Хариу бичнэ үү'),
    },
  });

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
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
        highlightOnHover
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
            render: ({ id }) => (
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
