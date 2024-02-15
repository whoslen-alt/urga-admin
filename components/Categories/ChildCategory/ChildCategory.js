import { ActionIcon, Badge, Group, MultiSelect, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconTrash } from '@tabler/icons';
import { IconEdit, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import CategoryEditor from '../../CategoryEditor/CategoryEditor';
import { useState } from 'react';
import { useCategories } from '../../../hooks';
import dayjs from 'dayjs';
const PAGE_SIZE = 15;
const ChildCategory = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isPending, isFetching } = useCategories('3', PAGE_SIZE, pageNumber - 1);

  return (
    <DataTable
      height="75vh"
      minHeight="75vh"
      fontSize="xs"
      borderRadius="sm"
      withBorder
      withColumnBorders
      records={data?.categories}
      totalRecords={data?.meta?.total}
      recordsPerPage={PAGE_SIZE}
      page={pageNumber}
      fetching={isFetching}
      onPageChange={(p) => setPageNumber(p)}
      noRecordsText="Ангилал олдсонгүй"
      rowExpansion={{
        trigger: 'never',

        content: ({ record, collapse }) => (
          //   <CategoryEditor
          //     initialData={record}
          //     type={activeTab}
          //     categories={{ mainCategories, parentCategories, childCategories }}
          //     collapse={collapse}
          //     onSubmit={updateCategory}
          //   />
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
          accessor: 'parent_cat.name',
          title: 'Дэд ангилал',
          width: 160,
        },
        {
          accessor: 'parent_cat.parent_cat.name',
          title: 'Ерөнхий ангилал',
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
          render: ({ createdAt }) => <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>,
        },
        {
          accessor: 'updatedAt',
          title: 'Сүүлд засварласан огноо',
          textAlignment: 'center',
          sortable: true,
          width: 90,
          render: ({ updatedAt }) => <Text>{dayjs(updatedAt).format('YYYY-MM-DD HH:MM:ss')}</Text>,
        },
        // {
        //   accessor: 'actions',
        //   title: <Text>Үйлдэл</Text>,
        //   textAlignment: 'center',
        //   width: 60,
        //   render: (record) => (
        //     <Group spacing={4} position="center">
        //       <ActionIcon
        //         color="blue"
        //         onClick={(e) => {
        //           e.stopPropagation();
        //           setEditing({
        //             type: 'child',
        //           });
        //           setExpandedRecordIds([record.id]);
        //         }}
        //       >
        //         <IconEdit size={16} />
        //       </ActionIcon>
        //       <ActionIcon
        //         color="red"
        //         onClick={(e) => {
        //           e.stopPropagation();
        //           openDeleteConfirmation(record.id, record.name);
        //         }}
        //       >
        //         <IconTrash size={16} />
        //       </ActionIcon>
        //     </Group>
        //   ),
        // },
      ]}
    />
  );
};

export default ChildCategory;
