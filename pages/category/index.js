import {
  Container,
  Grid,
  Title,
  Tabs,
  Box,
  MediaQuery,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Flex,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import { IconPlus, IconUsers } from '@tabler/icons';

function Category() {
  const [selectedRecords, setSelectedRecords] = useState([]);
  useEffect(() => {
    console.log(selectedRecords);
  }, [selectedRecords]);

  return (
    <DefaultLayout>
      <Container fluid mx="xs" sx={{ maxHeight: '100%' }}>
        <Grid>
          <Grid.Col md={6} lg={3}>
            <Card withBorder shadow="sm" radius="md">
              <Group>
                <Flex
                  mih={50}
                  bg="rgba(0, 0, 0, .3)"
                  gap="md"
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  wrap="wrap"
                ></Flex>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DefaultLayout>
  );
}
export async function getServerSideProps() {
  //     const res = await fetch(`https://.../data`)
  //   const data = await res.json()

  // Pass data to the page via props
  return { props: {} };
}

export default Category;
