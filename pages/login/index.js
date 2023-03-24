import {
  TextInput,
  PasswordInput,
  Title,
  Container,
  Group,
  Button,
  Stack,
  Center,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconLock, IconUser } from '@tabler/icons';
import axios from 'axios';
import Image from 'next/image';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';

export default function Login() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: isNotEmpty('Нэвтрэх нэр оруулна уу'),
      password: isNotEmpty('Нууц үг оруулна уу'),
    },
  });
  const handleLogin = async ({ username, password }) => {
    axios
      .post('/api/auth/login', { username, password })
      .then((value) => {
        if (value.status === 200) {
          router.push('/');
        } else {
          showNotification({
            title: 'Нэвтрэхэд алдаа гарлаа',
            message: value.data.message,
            color: 'red',
          });
        }
      })
      .catch((err) => {
        showNotification({
          title: 'Нэвтрэхэд алдаа гарлаа',
          message: err.response.data.message,
          color: 'red',
        });
      });
  };
  return (
    <Stack align="flex-end" justify="flex-start" mt="lg" mr="lg">
      <ColorSchemeToggle />
      <Container size={480} my={40}>
        <Center>
          <Image src="/logo.png" width={80} height={80} alt="Urgamal Tarimal LLC" />
        </Center>
        <Title
          align="center"
          mt="lg"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Таримал Ургамал ХХК
        </Title>
        <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
          <Stack p={30} spacing="xs" mt="lg">
            <TextInput
              styles={{
                label: { marginBottom: 6, marginLeft: 5 },
                error: {
                  marginLeft: 5,
                },
              }}
              icon={<IconUser size="1rem" />}
              radius="xl"
              label="Нэвтрэх нэр"
              {...form.getInputProps('username')}
            />
            <PasswordInput
              styles={{
                label: { marginBottom: 6, marginLeft: 5 },
                error: {
                  marginLeft: 5,
                },
              }}
              icon={<IconLock size="1rem" />}
              radius="xl"
              label="Нууц үг"
              mt="md"
              {...form.getInputProps('password')}
            />
            <Group position="apart" mt="lg">
              {/* <Checkbox label="Remember me" /> */}
              {/* <Anchor component="button" size="sm">
              Forgot password?
            </Anchor> */}
            </Group>
            <Button radius="xl" fullWidth mt="xl" type="submit">
              Нэвтрэх
            </Button>
          </Stack>
        </form>
      </Container>
    </Stack>
  );
}
