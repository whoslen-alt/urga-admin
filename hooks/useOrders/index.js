import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchOrders = async ({ status, orderId, fromDate, untilDate, limit, offset }, userToken) => {
  const parsed = await ky(
    `${process.env.NEXT_PUBLIC_API}/admin/order?fromDate=${fromDate}&untilDate=${untilDate}&offset=${offset}&limit=${limit}&orderid=${orderId}&status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  ).json();
  return parsed;
};

const useOrders = ({ status, orderId, fromDate, untilDate, limit, offset, keys }, userToken) => {
  return useQuery({
    queryKey: ['orders', status, orderId, fromDate, untilDate, limit, offset, keys],
    queryFn: () => fetchOrders({ status, orderId, fromDate, untilDate, limit, offset }, userToken),
  });
};

export { useOrders, fetchOrders };
