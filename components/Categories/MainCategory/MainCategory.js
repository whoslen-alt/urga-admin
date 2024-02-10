import { DataTable } from 'mantine-datatable';
import { ActionIcon, Badge, Group, Image, MultiSelect, Text } from '@mantine/core';
import { IconPhoto, IconPhotoUp, IconCheck } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import dayjs from 'dayjs';
import { useDisclosure } from '@mantine/hooks';
import { CategoryModal } from '../../CategoryModal/CategoryModal';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

const PAGE_SIZE = 15;

const MainCategory = ({ userToken }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [currentCategoryId, setCurrentCategoryId] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { data, isPending, isFetching, refetch, isRefetching } = useCategories(
    '1',
    PAGE_SIZE,
    pageNumber - 1
  );
  const [opened, { open, close }] = useDisclosure(false);

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const uploadCategoryImg = async ({ img }) => {
    const title = 'Ангилал зураг';
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('img', img, img.name);
      formData.append('categoryid', currentCategoryId);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/product/cat`,
        formData,
        config
      );
      if (res.status === 200 && res.data?.success) {
        showNotification({
          title,
          message: res.data.message,
          color: 'green',
          icon: <IconCheck />,
        });
        await refetch();
      } else {
        showNotification({
          title: title + ' амжилтгүй',
          message: res.data.message,
          color: 'red',
        });
      }
    } catch (e) {
      showNotification({
        title: title + ' амжилтгүй',
        // message: e.response.data.message,
        color: 'red',
      });
    }
    setIsUploading(false);
  };

  return (
    <>
      <CategoryModal
        opened={opened}
        close={close}
        loading={isUploading}
        type="main"
        onSubmit={uploadCategoryImg}
      />
      <DataTable
        height="75vh"
        minHeight="75vh"
        fontSize="xs"
        borderRadius="sm"
        withBorder
        withColumnBorders
        highlightOnHover
        records={data?.categories}
        // selectedRecords={selectedRecords}
        // onSelectedRecordsChange={setSelectedRecords}
        fetching={isFetching || isPending || isRefetching}
        totalRecords={data?.meta?.total}
        recordsPerPage={PAGE_SIZE}
        page={pageNumber}
        onPageChange={(p) => setPageNumber(p)}
        noRecordsText="Ангилал олдсонгүй"
        idAccessor="id"
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
            width: 200,
            render: (r) => <Text weight={500}>{r.name}</Text>,
          },
          {
            accessor: 'icon',
            title: 'Зураг',
            width: 65,
            textAlignment: 'center',
            render: ({ name, icon }) => (
              <Image
                height={35}
                width={35}
                src={icon}
                alt={name}
                withPlaceholder
                placeholder={<IconPhoto />}
              />
            ),
          },
          {
            accessor: 'child_cats',
            title: 'Дэд ангиллууд',
            render: ({ child_cats, id }) => (
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
                data={child_cats?.map((e) => ({ value: e.id.toString(), label: e.name }))}
                defaultValue={child_cats?.map((e) => e.id.toString())}
                readOnly
              />
            ),
            width: 160,
          },
          // {
          //   accessor: 'active',
          //   title: 'Идэвхитэй эсэх',
          //   width: 70,
          //   textAlignment: 'center',
          //   render: (record) => (
          //     <Badge
          //       color={record.active ? 'green' : 'red'}
          //       size="sm"
          //       variant="filled"
          //       styles={{
          //         inner: {
          //           textTransform: 'capitalize',
          //           fontWeight: 500,
          //         },
          //         root: {
          //           padding: '8px 8px 9px 8px',
          //         },
          //       }}
          //     >
          //       {record.active ? 'Идэвхитэй' : 'Идэвхигүй'}
          //     </Badge>
          //   ),
          // },
          {
            accessor: 'createdAt',
            title: 'Үүсгэсэн огноо',
            textAlignment: 'center',
            sortable: true,
            width: 90,
            render: ({ createdAt }) => (
              <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
            ),
          },
          {
            accessor: 'updatedAt',
            title: 'Сүүлд засварласан огноо',
            textAlignment: 'center',
            sortable: true,
            width: 90,
            render: ({ updatedAt }) => (
              <Text>{dayjs(updatedAt).format('YYYY-MM-DD HH:MM:ss')}</Text>
            ),
          },
          {
            accessor: 'actions',
            title: <Text>Зураг оруулах</Text>,
            textAlignment: 'center',
            width: 60,
            render: ({ id }) => (
              <Group spacing={4} position="center">
                <ActionIcon
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCategoryId(id);
                    open();
                  }}
                >
                  <IconPhotoUp size={16} />
                </ActionIcon>
                {/* <ActionIcon
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirmation(record.id, record.name);
                }}
              >
                <IconTrash size={16} />
              </ActionIcon> */}
              </Group>
            ),
          },
        ]}
      />
    </>
  );
};
export default MainCategory;
