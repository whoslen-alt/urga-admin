import {
  ActionIcon,
  AspectRatio,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Skeleton,
  Text,
} from '@mantine/core';
import requireAuthentication from '../../lib/requireAuthentication';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { BranchModal } from '../../components/BranchModal/BranchModal';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';
import { htmlFrom } from '../../lib/utils';
import { IconCheck, IconTrash } from '@tabler/icons';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';

const Branch = ({ userToken }) => {
  const [editingData, setEditingData] = useState();
  const [deletingBranch, setDeletingBranch] = useState();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [branches, setBranches] = useState([]);

  const [opened, { open, close }] = useDisclosure(false);

  const [confirmationOpened, { open: openConfirmation, close: closeConfirmation }] =
    useDisclosure(false);

  const openModal = (data, type = 'edit') => {
    if (type === 'creation') {
      setEditingData({ create: true });
    } else {
      setEditingData(data);
    }
    open();
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await axios(`${process.env.NEXT_PUBLIC_API}/config/branch`, config);
      const branches = res.data?.data;
      if (branches) {
        setBranches(branches);
      }
    } catch (e) {}
    setLoading(false);
  };

  const createBranch = async ({
    name,
    address,
    phone,
    time_table,
    longtitute,
    latitute,
    images,
  }) => {
    setUpdating(true);
    const title = 'Салбар үүсгэлт';
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/config/branch`,
        {
          name,
          address,
          phone,
          time_table,
          longtitute,
          latitute,
          img_url: images,
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
        await fetchBranches();
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
  const updateBranch = async ({
    name,
    address,
    phone,
    time_table,
    longtitute,
    latitute,
    images,
  }) => {
    setUpdating(true);
    const title = 'Салбарын мэдээлэл шинэчлэлт';
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/config/branch`,
        {
          id: editingData?.id,
          name,
          address,
          phone,
          time_table,
          longtitute,
          latitute,
          img_url: images,
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
        await fetchBranches();
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

  const deleteBranch = async (id) => {
    setDeleting(true);
    const title = 'Салбарын мэдээлэл устгал';
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/config/branch?id=${id}`,
        config
      );
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await fetchBranches();
      } else {
        showNotification({
          title,
          message: res.data.message,
          color: 'red',
        });
      }

      closeConfirmation();
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
    setDeleting(false);
  };

  return (
    <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
      <BranchModal
        userToken={userToken}
        opened={opened}
        close={close}
        initialData={editingData}
        onSubmit={editingData?.create ? createBranch : updateBranch}
        loading={updating}
      />

      <DeleteConfirmationDialog
        isOpen={confirmationOpened}
        close={closeConfirmation}
        confirmationText="Салбарын мэдээлэл устгахдаа итгэлтэй байна уу?"
        thingToDelete={deletingBranch}
        onConfirm={deleteBranch}
        loading={deleting}
      />
      <Flex direction="column" gap={20}>
        <Grid position="apart" grow>
          <Grid.Col span={2}>
            <Text size="lg" weight={500}>
              Салбарууд
            </Text>
          </Grid.Col>
          <Grid.Col offset={8} span={1}>
            <Button
              variant="filled"
              radius="xl"
              styles={{ label: { padding: 12 } }}
              onClick={(e) => {
                e.preventDefault();
                openModal({}, 'creation');
              }}
            >
              Салбар нэмэх
            </Button>
          </Grid.Col>
        </Grid>
        <Grid gutter="xl">
          {/* <Grid.Col span={12}>
            <Skeleton visible={loading} />
          </Grid.Col> */}
          {branches.map((branch) => (
            <Grid.Col span={12} xs={12} sm={6} md={4} key={branch?.id}>
              <Card
                sx={{ cursor: 'pointer' }}
                withBorder
                shadow="sm"
                padding="lg"
                onClick={() => openModal(branch)}
              >
                <Card.Section>
                  <AspectRatio ratio={1080 / 720} h={240}>
                    <Image src={branch?.img_url?.[0]} alt={branch?.name + 'зураг'} />
                  </AspectRatio>
                </Card.Section>

                <Group position="apart" align="center">
                  <Text fw={500} size="lg" mt="md">
                    {branch?.name}
                  </Text>
                  <ActionIcon
                    radius="lg"
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingBranch({ name: branch?.name, id: branch?.id });
                      openConfirmation();
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                {/* {htmlFrom(branch?.address)}
                {htmlFrom(branch?.phone)}
                {htmlFrom(branch?.time_table)} */}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
};

export const getServerSideProps = requireAuthentication(async ({ req, res }) => {
  // const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/config/layout`, {
  //   headers: {
  //     Authorization: `Bearer ${req.cookies.urga_admin_user_jwt}`,
  //   },
  // });
  return {
    props: {
      userToken: req.cookies.urga_admin_user_jwt,
    },
  };
});

export default Branch;
