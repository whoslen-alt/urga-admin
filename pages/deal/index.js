import { DataTable } from 'mantine-datatable';
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  MultiSelect,
  Text,
} from '@mantine/core';
import {
  IconPhoto,
  IconPhotoUp,
  IconCheck,
  IconTrash,
  IconPencil,
  IconEdit,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
// import { CategoryModal } from '../../CategoryModal/CategoryModal';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { useDeals } from '../../hooks/useDeals';
import DealModal from '../../components/DealModal/DealModal';
import requireAuthentication from '../../lib/requireAuthentication';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';

const PAGE_SIZE = 15;

const Deal = ({ userToken }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [keys, setKeys] = useState('');
  const [editingDealData, setEditingDealData] = useState(null);
  const [deletingDealData, setDeletingDealData] = useState({ id: null, name: '' });
  const [deleting, setDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] =
    useDisclosure(false);

  const { data, isLoading, isFetching } = useDeals(keys, PAGE_SIZE, pageNumber - 1);
  const [opened, { open, close }] = useDisclosure(false);
  const [creatingOpened, { open: openCreating, close: closeCreating }] = useDisclosure(false);

  const openDeleteConfirmation = (id, name) => {
    setDeletingDealData({ id, name });
    openConfirmation();
  };

  const openDealEditingModal = (data, type = 'edit') => {
    if (type === 'creation') {
      setEditingDealData({ create: true });
    } else {
      setEditingDealData(data);
    }
    open();
  };

  const createDeal = async ({ productids, icon, name, description, start_date, end_date }) => {
    const title = 'Тохиргооны тогтмол үүсгэлт';
    setCreating(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/deal`,
        {
          productids,
          icon,
          name,
          description,
          start_date,
          end_date,
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
    setCreating(false);
    close();
  };

  const updateDeal = async ({ id, productids, icon, name, description, start_date, end_date }) => {
    const title = 'Deal засвар';
    setCreating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/deal`,
        {
          id,
          productids,
          icon,
          name,
          description,
          start_date,
          end_date,
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
          message: res.data.message || 'амжилттай',
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
    setCreating(false);
    close();
  };

  const deleteDeal = async (id) => {
    const title = 'Deal устгалт';
    setDeleting(true);
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/admin/deal?id=${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.status === 200) {
        showNotification({
          title,
          message: res.data.message || 'амжилттай',
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
    setDeleting(false);
    closeConfirmation();
  };

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <DealModal
        loading={creating || updating}
        userToken={userToken}
        initialData={editingDealData}
        isOpen={opened}
        close={close}
        onSubmit={editingDealData?.create ? createDeal : updateDeal}
      />
      <DeleteConfirmationDialog
        isOpen={confirmationOpened}
        close={closeConfirmation}
        confirmationText="Энэ deal- ийг устгах уу?"
        thingToDelete={deletingDealData}
        onConfirm={deleteDeal}
        loading={deleting}
      />
      <Grid justify="space-between" grow>
        <Grid.Col span={9}>
          <Text size="lg" weight={500}>
            Special deals
          </Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Button
            variant="filled"
            radius="xl"
            styles={{ label: { padding: 12 } }}
            onClick={(e) => {
              e.preventDefault();
              openDealEditingModal({}, 'creation');
            }}
          >
            Үүсгэх
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
        records={data?.data}
        // selectedRecords={selectedRecords}
        // onSelectedRecordsChange={setSelectedRecords}
        fetching={isLoading}
        // totalRecords={data?.meta?.total}
        recordsPerPage={PAGE_SIZE}
        page={pageNumber}
        onPageChange={(p) => setPageNumber(p)}
        noRecordsText="Deal олдсонгүй"
        idAccessor="id"
        pinLastColumn
        rowExpansion={{
          trigger: 'never',
          content: ({ record, collapse }) => (
            // <CategoryEditor
            //   initialData={record}
            //   type={activeTab}
            //   categories={{ mainCategories, parentCategories, childCategories }}
            //   collapse={collapse}
            //   onSubmit={updateCategory}
            // />
            <></>
          ),
        }}
        columns={[
          {
            accessor: 'name',
            title: 'Нэр',
            width: 100,
            render: ({ name }) => <Text weight={500}>{name}</Text>,
          },
          {
            accessor: 'description',
            title: 'Тайлбар',
            width: 100,
            render: ({ description }) => <Text weight={500}>{description}</Text>,
          },
          {
            accessor: 'icon',
            title: 'Зураг',
            width: '0%  ',
            render: ({ name, icon }) => (
              <Image
                height={80}
                width={80}
                src={icon}
                alt={name}
                withPlaceholder
                placeholder={<IconPhoto />}
              />
            ),
          },
          // {
          //   accessor: 'special_deals',
          //   title: 'Бараа',
          //   width: '0%',
          //   textAlignment: 'center',
          //   render: ({ special_deals }) => <Text weight={500}>{special_deals?.length}</Text>,
          // },
          {
            accessor: 'products',
            title: 'Бараа',
            render: ({ products, id }) => (
              <MultiSelect
                size="xs"
                placeholder="Байхгүй"
                styles={(theme) => ({
                  input: {
                    border: 'none',
                    backgroundColor: 'transparent',
                    ':hover': {
                      cursor: 'default',
                    },
                  },
                  value: {
                    backgroundColor: theme.colors.blue[0],
                    color: theme.colorScheme === 'dark' && 'black',
                  },
                  searchInput: {
                    ':hover': {
                      cursor: 'default',
                    },
                  },
                })}
                data={products?.map((e) => ({ value: e.id.toString(), label: e.name }))}
                defaultValue={products?.map((e) => e.id.toString())}
                readOnly
              />
            ),
            width: '100%',
          },
          {
            accessor: 'start_date',
            title: 'Эхлэх огноо',
            textAlignment: 'center',
            width: '100%',
            render: ({ start_date }) => (
              <Text>{dayjs(start_date).format('YYYY-MM-DD HH:MM:ss')}</Text>
            ),
          },
          {
            accessor: 'end_date',
            title: 'Дуусах огноо',
            textAlignment: 'center',
            width: '100%',
            render: ({ end_date }) => <Text>{dayjs(end_date).format('YYYY-MM-DD HH:MM:ss')}</Text>,
          },
          {
            accessor: 'active',
            title: 'Идэвхитэй эсэх',
            width: '0%',
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
              <Group spacing={4} position="center" noWrap>
                <ActionIcon
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDealEditingModal(record);
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
  );
};

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  return {
    props: {
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default Deal;
