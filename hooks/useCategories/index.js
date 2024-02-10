import ky from 'ky';
import { useQuery } from '@tanstack/react-query';

const fetchCategories = async (level = 1, limit = 15, offset = 0) => {
  const parsed = await ky(
    `${process.env.NEXT_PUBLIC_API}/product/cats?level=${level}&limit=${limit}&offset=${offset}`
  ).json();
  return parsed;
};

const useCategories = (level, limit, offset) => {
  return useQuery({
    queryKey: ['categories', level, limit, offset],
    queryFn: () => fetchCategories(level, limit, offset),
  });
};

export { useCategories, fetchCategories };
