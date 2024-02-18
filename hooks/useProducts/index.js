import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchProducts = async ({ query, limit, offset }, userToken) => {
  const parsed = await ky(
    `${process.env.NEXT_PUBLIC_API}/product/admin?offset=${offset}&limit=${limit}&query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  ).json();
  return parsed;
};

const useProducts = ({ query, limit, offset, keys }, userToken) => {
  return useQuery({
    queryKey: ['products', query, limit, offset, keys],
    queryFn: () => fetchProducts({ query, limit, offset }, userToken),
  });
};

export { useProducts, fetchProducts };
