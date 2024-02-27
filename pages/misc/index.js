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
  IconX,
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
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { modals } from '@mantine/modals';
import MiscModal from '../../components/MiscModal/MiscModal';

const PAGE_SIZE = 15;
const dateFormat = 'YYYY-MM-DD';

function Feedback({ userToken }) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(null);
  const [query, setQuery] = useState('');
  const [debounced] = useDebouncedValue(query, 500);
  const [popovers, setPopovers] = useState([]);
  const [dates, setDates] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [orderFilterValue, setOrderFilterValue] = useState('all');
  const [deletingMisc, setDeletingMisc] = useState({ id: null, name: '' });
  const orderStatuses = useMemo(() => refundStatus, []);
  const [creatingOpened, { open: openCreating, close: closeCreating }] = useDisclosure(false);
  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] =
    useDisclosure(false);
  const form = useForm({
    initialValues: {
      key: '',
      value: '',
    },
    validate: {
      key: isNotEmpty('Төлөв сонгоно уу'),
      value: isNotEmpty('Хариу бичнэ үү'),
    },
  });

  useEffect(() => {
    fetchPage(page);
  }, [dates]);

  useEffect(() => {
    fetchPage(1);
  }, [orderFilterValue]);

  useEffect(() => {
    if (isBeingEdited) {
      form.setValues({
        key: isBeingEdited?.key,
        value: isBeingEdited?.value,
      });
    }
  }, [isBeingEdited]);

  //   useEffect(() => {
  //     handleSearch();
  //   }, [debounced]);

  //   useEffect(() => {
  //     setPage(1);
  //   }, [handleSearch]);

  const openDeleteConfirmation = (id, name) => {
    setDeletingMisc({ id, name });
    openConfirmation();
  };
  const createMisc = async ({ key, value }) => {
    const title = 'Тохиргооны тогтмол үүсгэлт';
    setCreating(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/misc`,
        {
          slug: key,
          value,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
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
        await fetchPage(1);
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
    setCreating(false);
    closeCreating();
  };

  const deleteMisc = async (key) => {
    const title = 'Тохиргоо устгалт';
    setDeleting(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/misc?slug=${key}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchPage(1);
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
    closeConfirmation();
  };

  const updateMiscValue = async (key, value) => {
    const title = 'Тохиргоо өөрчлөлт';
    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/misc`,
        {
          slug: key,
          value,
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
        setIsBeingEdited(null);
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/config/misc/list`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setRecords(res.data.data);
      setTotal(res.data.meta?.total);
      setLoading(false);
    } catch (e) {}
  };

  const openUpdateConfirmation = (key, value) =>
    modals.openConfirmModal({
      title: 'Өөрчлөлт оруулахдаа итгэлтэй байна уу?',
      children: <Text size="sm">Тохиргооны тогтмолд өөрчлөлт орох гэж байна.</Text>,
      centered: true,
      labels: { confirm: 'Тийм', cancel: 'Үгүй' },
      onConfirm: async () => await updateMiscValue(key, value),
    });

  const renderActions = (record) => {
    return (
      <Group spacing={4} noWrap>
        <ActionIcon
          color="blue"
          loading={updating}
          onClick={async (e) => {
            e.stopPropagation();
            if (isBeingEdited) {
              form.validate();
              if (form.isValid()) {
                openUpdateConfirmation(form.values.key, form.values.value);
              }
            } else {
              setIsBeingEdited({ id: record.id, key: record?.key, value: record?.value });
            }
          }}
        >
          {isBeingEdited?.id === record.id ? <IconCheck size={16} /> : <IconEdit size={16} />}
        </ActionIcon>
        <ActionIcon
          color="red"
          loading={updating}
          onClick={(e) => {
            e.stopPropagation();
            if (isBeingEdited) {
              setIsBeingEdited(null);
            } else {
              openDeleteConfirmation(record.id, record.key);
            }
          }}
        >
          {isBeingEdited?.id === record.id ? <IconX size={16} /> : <IconTrash size={16} />}
        </ActionIcon>
      </Group>
    );
  };

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <MiscModal
        isOpen={creatingOpened}
        close={closeCreating}
        onSubmit={createMisc}
        loading={creating}
      />
      <DeleteConfirmationDialog
        isOpen={confirmationOpened}
        close={closeConfirmation}
        confirmationText="Энэ тохиргоог устгах уу?"
        thingToDelete={deletingMisc}
        deleteKey={deletingMisc?.name}
        onConfirm={deleteMisc}
        loading={deleting}
      />
      <Grid justify="space-between" grow>
        <Grid.Col span={6}>
          <Text size="lg" weight={500}>
            Тохиргооны тогтмолууд
          </Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Button
            variant="filled"
            radius="xl"
            styles={{ label: { padding: 12 } }}
            onClick={(e) => {
              e.preventDefault();
              openCreating();
            }}
          >
            Тохиргооны тогтмол үүсгэх
          </Button>
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
        noRecordsText="Хоосон байна"
        columns={[
          {
            accessor: 'key',
            title: 'Нэр',
            width: 200,
            render: ({ key }) => <Badge>{key}</Badge>,
          },
          {
            accessor: 'value',
            title: 'Утга',
            width: 200,
            render: ({ id, value }) =>
              isBeingEdited?.id === id ? (
                <TextInput
                  size="xs"
                  placeholder="Утга оруулна уу"
                  {...form.getInputProps('value')}
                  onChange={(e) => form.setFieldValue('value', e.target.value)}
                />
              ) : (
                <Badge color="teal" variant="filled">
                  {value}
                </Badge>
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
            width: '0%',
            render: renderActions,
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
