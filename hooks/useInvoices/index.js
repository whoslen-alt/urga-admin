import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchInvoices = async ({ status, fromDate, untilDate, limit, offset }, userToken) => {
  const parsed = await ky(
    `${process.env.NEXT_PUBLIC_API}/order/invoice?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  ).json();
  return parsed;
};

const useInvoices = ({ status, fromDate, untilDate, limit, offset }, userToken) => {
  return useQuery({
    queryKey: ['refunds', status, fromDate, untilDate, limit, offset],
    queryFn: () => fetchInvoices({ status, fromDate, untilDate, limit, offset }, userToken),
  });
};

export { useInvoices, fetchInvoices };
