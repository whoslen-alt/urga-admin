import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchRoles = async (userToken) => {
  const parsed = await ky(`${process.env.NEXT_PUBLIC_API}/admin/employee/role`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  }).json();
  return parsed;
};

const useRoles = (userToken) => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => fetchRoles(userToken),
  });
};

export { useRoles, fetchRoles };
