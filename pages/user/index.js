import { Container, ActionIcon, Button, Grid, Text, Group, Badge } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import { IconTrash, IconEdit, IconCheck } from '@tabler/icons';
import requireAuthentication from '../../lib/requireAuthentication';
import axios from 'axios';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import UserModal from '../../components/UserModal/UserModal';
import { showNotification } from '@mantine/notifications';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';

const PAGE_SIZE = 15;

function User({ users, total: totalUsers, userToken }) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalUsers);
  const [records, setRecords] = useState(users);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingUser, setDeletingUser] = useState({ userid: null, name: null });
  const [editingUserData, setEditingUserData] = useState();
  useEffect(() => {}, []);
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] =
    useDisclosure(false);
  const fetchPage = async (pageNumber) => {
    setLoading(true);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const res = await axios(
      `${process.env.NEXT_PUBLIC_API}/admin/employees?offset=${from}&limit=${PAGE_SIZE}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    setRecords(res.data.data);
    setTotal(res.data.data.length);
    setLoading(false);
  };
  const createProduct = async (values) => {
    setUpdating(true);
    const title = 'Админ хэрэглэгч үүсгэлт';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/register`,
        {
          username: values.username,
          email: values.email,
          password: values.password,
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
        await fetchPage(page);
      } else {
        showNotification({
          title,
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      e.response
        ? showNotification({
            title,
            message: e.response.data.message,
            color: 'red',
          })
        : showNotification({
            title,
            message: e.message,
            color: 'red',
          });
    }
    setUpdating(false);
  };
  const updateProduct = async (values) => {
    setUpdating(true);
    const title = 'Админ хэрэглэгчийн мэдээлэл шинэчлэлт';
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/profile`,
        {
          userid: values.userid,
          username: values.username,
          email: values.email,
          active: values.active,
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
    setUpdating(false);
  };

  const deleteUser = async (id) => {
    setLoading(true);
    const title = 'Админ хэрэглэгч идэвхигүй болголт';
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/profile`,
        {
          userid: id,
          active: false,
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
        await fetchPage(page);
      } else {
        showNotification({
          title,
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      e.response
        ? showNotification({
            title,
            message: e.response.data.message,
            color: 'red',
          })
        : showNotification({
            title,
            message: e.message,
            color: 'red',
          });
    }
    setLoading(false);
  };

  const openDeleteConfirmation = (userid, userName, email) => {
    setDeletingUser({ id: userid, name: userName, email: email });
    openConfirmation();
  };

  const openUserEditingModal = (productData, type = 'edit') => {
    if (type === 'creation') {
      setEditingUserData({ create: true });
    } else {
      setEditingUserData(productData);
    }
    open();
  };
  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <UserModal
          isOpen={opened}
          close={close}
          initialData={editingUserData}
          onSubmit={editingUserData?.create ? createProduct : updateProduct}
          loading={updating}
        />
        <DeleteConfirmationDialog
          isOpen={confirmationOpened}
          close={closeConfirmation}
          confirmationText="Хэрэглэгчийг идэвхигүй болгох уу?"
          thingToDelete={deletingUser}
          onConfirm={deleteUser}
          loading={deleting}
        />
        <Grid position="apart" grow>
          <Grid.Col span={2}>
            <Text size="lg" weight={500}>
              Админ хэрэглэгчид
            </Text>
          </Grid.Col>

          <Grid.Col offset={8} span={1}>
            <Button
              variant="filled"
              radius="xl"
              styles={{ label: { padding: 12 } }}
              onClick={(e) => {
                e.preventDefault();
                openUserEditingModal({}, 'creation');
              }}
            >
              Хэрэглэгч Үүсгэх
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
          highlightOnHover
          records={records}
          fetching={loading}
          page={page}
          onPageChange={(pageNum) => {
            setPage(pageNum);
            fetchPage(pageNum);
          }}
          totalRecords={total}
          recordsPerPage={PAGE_SIZE}
          noRecordsText="Бүртгэгдсэн хэрэглэгч олдсонгүй"
          idAccessor="userid"
          columns={[
            {
              accessor: 'username',
              title: 'Нэр',
            },
            {
              accessor: 'email',
              title: 'И-мейл',
              // render: (r) => <Text weight={500}>{r.name}</Text>,
            },
            {
              accessor: 'last_login_at',
              title: 'Сүүлд нэвтэрсэн огноо',
              textAlignment: 'center',

              width: 180,
              render: ({ last_login_at }) =>
                last_login_at ? (
                  <Text>{dayjs(last_login_at).format('YYYY-MM-DD HH:MM:ss')}</Text>
                ) : (
                  ''
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
              accessor: 'createdAt',
              title: 'Үүсгэсэн огноо',
              textAlignment: 'center',
              width: 180,
              render: ({ createdAt }) => (
                <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
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
                      openUserEditingModal(record);
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      const { userid, username, email } = record;
                      openDeleteConfirmation(userid, username, email);
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
  const from = 0;
  const to = PAGE_SIZE;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/admin/employees?offset=${from}&limit=${to}`,
    {
      headers: {
        Authorization: `Bearer ${req.cookies.urga_admin_user_jwt}`,
      },
    }
  );
  return {
    props: {
      users: response.data.data,
      total: response.data.data.length,
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default User;
