import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchRefunds = async ({ status, fromDate, untilDate, limit, offset }, userToken) => {
  const parsed = await ky
    .post(`${process.env.NEXT_PUBLIC_API}/order/refund/list`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      json: {
        ...(status && { status }),
        fromDate,
        untilDate,
        limit,
        offset,
      },
    })
    .json();
  return parsed;
};

const useRefunds = ({ status, fromDate, untilDate, limit, offset, keys }, userToken) => {
  return useQuery({
    queryKey: ['refunds', status, fromDate, untilDate, limit, offset, keys],
    queryFn: () => fetchRefunds({ status, fromDate, untilDate, limit, offset }, userToken),
  });
};

export { useRefunds, fetchRefunds };
