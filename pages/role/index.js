import { Container, ActionIcon, Button, Grid, Text, Group, Badge, Flex } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { IconTrash, IconEdit, IconCheck } from '@tabler/icons';
import requireAuthentication from '../../lib/requireAuthentication';
import axios from 'axios';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RoleModal from '../../components/RoleModal/RoleModal';
import { IconUserPlus } from '@tabler/icons-react';

const PAGE_SIZE = 15;

function Role({ users, total: totalRoles, userToken }) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalRoles);
  const [records, setRecords] = useState(users);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingRole, setDeletingRole] = useState({ id: null, name: null });
  const [editingRoleData, setEditingRoleData] = useState();
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] =
    useDisclosure(false);
  const fetchPage = async (pageNumber) => {
    setLoading(true);
    const from = pageNumber - 1;
    const res = await axios(
      `${process.env.NEXT_PUBLIC_API}/admin/employee/role?offset=${from}&limit=${PAGE_SIZE}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    setRecords(res.data.data);
    setTotal(res.data.meta.total);
    setLoading(false);
  };

  const createRole = async (values) => {
    setUpdating(true);
    const title = 'Эрх үүсгэлт';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/employee/role`,
        {
          name: values.name,
          permissions: values.permissions,
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

  const updateRole = async (values) => {
    setUpdating(true);
    const title = 'Эрхийн мэдээлэл шинэчлэлт';
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/admin/employee/role`,
        {
          roleid: values.id,
          name: values.name,
          permissions: values.permissions,
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

  const deleteRole = async (id) => {
    setLoading(true);
    const title = 'Эрх устгал';
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/admin/employee/role?roleid=${id}`,
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
        closeConfirmation();
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

  const openDeleteConfirmation = (id, name) => {
    setDeletingRole({ id, name });
    openConfirmation();
  };

  const openRoleEditingModal = (roleData, type = 'edit') => {
    if (type === 'creation') {
      setEditingRoleData({ create: true });
    } else {
      setEditingRoleData(roleData);
    }
    open();
  };
  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <RoleModal
        isOpen={opened}
        close={close}
        initialData={editingRoleData}
        onSubmit={editingRoleData?.create ? createRole : updateRole}
        loading={updating}
      />
      <DeleteConfirmationDialog
        isOpen={confirmationOpened}
        close={closeConfirmation}
        confirmationText="Энэ эрхийн тохиргоог устгах уу?"
        thingToDelete={deletingRole}
        onConfirm={deleteRole}
        loading={deleting}
      />
      <Grid position="apart" grow>
        <Grid.Col span={4}>
          <Text size="lg" weight={500}>
            Эрхийн тохиргоо
          </Text>
        </Grid.Col>

        <Grid.Col offset={6} span={2}>
          <Button
            variant="filled"
            radius="xl"
            styles={{ label: { padding: 12 } }}
            onClick={(e) => {
              e.preventDefault();
              openRoleEditingModal({}, 'creation');
            }}
          >
            Эрх Үүсгэх
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
        fetching={loading}
        page={page}
        onPageChange={(pageNum) => {
          setPage(pageNum);
          fetchPage(pageNum);
        }}
        totalRecords={totalRoles || records?.length}
        noRecordsText="Бүртгэгдсэн эрх байхгүй байна"
        recordsPerPage={PAGE_SIZE}
        idAccessor="id"
        pinLastColumn
        columns={[
          {
            accessor: 'name',
            title: 'Нэр',
          },
          {
            accessor: 'permissions',
            title: 'Эрхүүд',
            width: 200,
            render: ({ permissions }) => (
              <Flex wrap="wrap" gap={5}>
                {permissions?.map((perm) => (
                  <Badge key={perm} variant="dot" size="xs">
                    {perm}
                  </Badge>
                ))}
              </Flex>
            ),
          },
          {
            accessor: 'createdAt',
            title: 'Үүсгэсэн огноо',
            textAlignment: 'center',
            width: 180,
            render: ({ createdAt }) =>
              createdAt ? <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text> : '',
          },
          {
            accessor: 'updatedAt',
            title: 'Сүүлд өөрчилсөн огноо',
            textAlignment: 'center',
            width: 180,
            render: ({ updatedAt }) =>
              updatedAt ? <Text>{dayjs(updatedAt).format('YYYY-MM-DD HH:MM:ss')}</Text> : '',
          },
          {
            accessor: 'createdUser.username',
            title: 'Үүсгэсэн',
            textAlignment: 'center',
          },
          // {
          //   accessor: 'updatedBy',
          //   title: 'Сүүлд өөрчилсөн',
          //   textAlignment: 'center',
          // },
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
              <Group spacing={4} noWrap>
                {/* <ActionIcon
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    openRoleEditingModal(record);
                  }}
                >
                  <IconUserPlus size={16} />
                </ActionIcon> */}
                <ActionIcon
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    openRoleEditingModal(record);
                  }}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    const { id, name } = record;
                    openDeleteConfirmation(id, name);
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
}

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  const from = 0;
  const to = PAGE_SIZE;
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API}/admin/employee/role?offset=${from}&limit=${to}`,
    {
      headers: {
        Authorization: `Bearer ${req.cookies.urga_admin_user_jwt}`,
      },
    }
  );
  return {
    props: {
      users: response.data.data,
      total: response.data.meta.total,
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default Role;
