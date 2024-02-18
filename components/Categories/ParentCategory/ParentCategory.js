import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Indicator,
  List,
  Loader,
  LoadingOverlay,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  MultiSelect,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { DataTable } from 'mantine-datatable';
import { IconTrash } from '@tabler/icons';
import { IconEdit, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useCategories } from '../../../hooks';
import dayjs from 'dayjs';

const PAGE_SIZE = 15;

const ParentCategory = () => {
  const beingEditedCategory = false;
  const [moreHovered, setMoreHovered] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { data: childrenCatData, isFetching: isFetchingChildren } = useCategories(
    '3',
    1000,
    pageNumber - 1
  );
  const { data, isPending, isFetching } = useCategories('2', PAGE_SIZE, pageNumber - 1);
  const { data: mainCatData, isFetching: isFetchingMain } = useCategories(
    '1',
    1000,
    pageNumber - 1
  );
  if (isFetchingChildren || isFetching || isFetchingMain) return <Loader />;
  return (
    <DataTable
      height="75vh"
      minHeight="75vh"
      fontSize="xs"
      borderRadius="sm"
      withBorder
      withColumnBorders
      records={data?.categories}
      // selectedRecords={selectedRecords}
      // onSelectedRecordsChange={setSelectedRecords}
      fetching={isFetching || isPending}
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
          accessor: 'parent_cat.name',
          title: 'Ерөнхий ангилал',
          width: 200,

          render: ({ parent_cat }) => (
            <Text weight={parent_cat && 500} color={!parent_cat && 'dimmed'}>
              {parent_cat ? parent_cat.name : 'Байхгүй'}{' '}
            </Text>
          ),
        },
        {
          accessor: 'tertiary_cats',
          title: 'Барааны ангиллууд',
          width: '0%',
          render: ({ tertiary_cats, id }) => (
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
              data={tertiary_cats?.map((e) => ({ value: e.id.toString(), label: e.name }))}
              defaultValue={tertiary_cats?.map((e) => e.id.toString())}
              readOnly
            />
          ),
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
          width: '0%',
          render: ({ createdAt }) => <Text>{dayjs(createdAt).format('YYYY-MM-DD HH:MM:ss')}</Text>,
        },
        {
          accessor: 'updatedAt',
          title: 'Сүүлд засварласан огноо',
          textAlignment: 'center',
          sortable: true,
          width: '0%',
          render: ({ updatedAt }) => <Text>{dayjs(updatedAt).format('YYYY-MM-DD HH:MM:ss')}</Text>,
        },
      ]}
    />
  );
};

export default ParentCategory;
