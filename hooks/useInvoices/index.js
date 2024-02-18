import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchInvoices = async ({ status, fromDate, untilDate, limit, offset }, userToken) => {
  const parsed = await ky(
    `${process.env.NEXT_PUBLIC_API}/order/invoice/list?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  ).json();
  return parsed;
};

const fetchInvoice = async ({ orderId }, userToken) => {
  const parsed = await ky(`${process.env.NEXT_PUBLIC_API}/order/invoice/file?orderid=${orderId}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  }).json();
  return parsed;
};

const useInvoices = ({ status, fromDate, untilDate, limit, offset, keys }, userToken) => {
  return useQuery({
    queryKey: ['refunds', status, fromDate, untilDate, limit, offset, keys],
    queryFn: () => fetchInvoices({ status, fromDate, untilDate, limit, offset }, userToken),
  });
};

const useInvoice = ({ orderId }, userToken) => {
  return useQuery({
    queryKey: ['refunds', orderId],
    queryFn: () => fetchInvoice({ orderId }, userToken),
  });
};

export { useInvoices, fetchInvoices, useInvoice };
