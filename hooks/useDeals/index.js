import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchDeals = async (limit = 15, offset = 0) => {
  const parsed = await ky(
    `${process.env.NEXT_PUBLIC_API}/admin/deal?limit=${limit}&offset=${offset}`
  ).json();
  return parsed;
};

const useDeals = (key, limit, offset) => {
  return useQuery({
    queryKey: ['deals', key, limit, offset],
    queryFn: () => fetchDeals(limit, offset),
  });
};

export { useDeals, fetchDeals };
