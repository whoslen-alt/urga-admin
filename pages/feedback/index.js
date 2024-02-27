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
import FeedbackInfoModal from '../../components/FeedbackInfoModal/FeedbackInfoModal';
import { feedbackStatus } from '../../lib/constants/feedback_status';

const PAGE_SIZE = 15;
const dateFormat = 'YYYY-MM-DD';

function Feedback({ userToken }) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [detail, setDetail] = useState(null);
  const [query, setQuery] = useState('');
  const [debounced] = useDebouncedValue(query, 500);
  const [popovers, setPopovers] = useState([]);
  const [dates, setDates] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [orderFilterValue, setOrderFilterValue] = useState('all');
  const [expandedRecordIds, setExpandedRecordIds] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
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

  useEffect(() => {
    fetchPage(page);
  }, [dates]);

  useEffect(() => {
    fetchPage(1);
  }, [orderFilterValue]);

  //   useEffect(() => {
  //     handleSearch();
  //   }, [debounced]);

  //   useEffect(() => {
  //     setPage(1);
  //   }, [handleSearch]);

  const sendReply = async ({ body, subject }) => {
    const title = 'Хариу илгээлт';
    setUpdating(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/feedback`,
        {
          body,
          subject,
          feedback_id: detail?.id,
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
        close();
        await fetchPage(page);
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

  const fetchPage = async (pageNumber) => {
    try {
      setLoading(true);
      const from = pageNumber - 1;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/admin/feedback`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setRecords(res.data.data);
      setTotal(res.data.meta?.total);
      setLoading(false);
    } catch (e) {}
  };

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <FeedbackInfoModal opened={opened} close={close} detail={detail} onSubmit={sendReply} />
      <Grid columns={24} position="apart" grow>
        <Grid.Col span={8}>
          <Text size="lg" weight={500}>
            Санал хүсэлт
          </Text>
        </Grid.Col>
        {/* <Grid.Col sm={4} xs={24}>
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
              onChange={setDates}
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
        records={records}
        totalRecords={total}
        recordsPerPage={PAGE_SIZE}
        fetching={loading}
        page={page}
        onPageChange={(pageNum) => {
          setPage(pageNum);
          fetchPage(pageNum);
        }}
        idAccessor="id"
        noRecordsText="Санал хүсэлт олдсонгүй"
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
            accessor: 'type',
            title: 'Төрөл',
            render: ({ type }) => <Badge> {type}</Badge>,
          },
          {
            accessor: 'title',
            title: 'Гарчиг',
          },
          {
            accessor: 'email',
            title: 'Холбогдох имейл',
          },
          {
            accessor: 'status',
            title: 'Төлөв',
            render: ({ status }) => (
              <Badge color={feedbackStatus[status]?.color}> {feedbackStatus[status]?.status}</Badge>
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
            render: ({ id, ...feedbackInfo }) => (
              <Group position="center" spacing={4} noWrap>
                <Tooltip label="Дэлгэрэнгүйг харах" withArrow position="bottom" withinPortal>
                  <ActionIcon
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetail(feedbackInfo);
                      open();
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                </Tooltip>

                <Button
                  variant="subtle"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetail({ isReply: true, id, ...feedbackInfo });
                    open();
                  }}
                >
                  Хариу өгөх
                </Button>
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

export default Feedback;
