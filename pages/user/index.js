import { Container, Title, Tabs, Box, MediaQuery } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import companies from './users.json';
import { IconPlus, IconUsers } from '@tabler/icons';

function User() {
  const [selectedRecords, setSelectedRecords] = useState([]);
  useEffect(() => {
    console.log(selectedRecords);
  }, [selectedRecords]);

  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <Tabs color="lime" defaultValue="users" mt="lg">
          <Tabs.List>
            <Tabs.Tab value="users" icon={<IconUsers size={14} />}>
              Админ хэрэглэгчид
            </Tabs.Tab>
            <Tabs.Tab value="creation" icon={<IconPlus size={14} />}>
              Бүртгэл
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="users" pt="xs">
            <Box sx={{ height: 500, maxHeight: '60%' }}>
              <DataTable
                mt="lg"
                withBorder
                borderRadius="sm"
                withColumnBorders
                highlightOnHover
                shadow={false}
                noRecordsText="Хэрэглэгч олдсонгүй"
                columns={[
                  { accessor: 'fullname', title: 'Овог нэр' },
                  { accessor: 'role', title: 'Эрх' },
                  { accessor: 'createdAt', title: 'Бүртгэсэн огноо' },
                  { accessor: 'үйлдэл', title: 'Үйлдэл' },
                ]}
                records={companies}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
              />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="creation" pt="xs">
            Messages tab content
          </Tabs.Panel>
        </Tabs>
      </Container>
    </DefaultLayout>
  );
}

export default User;
