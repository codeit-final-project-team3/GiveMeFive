import { SignupReturn } from '@/types/auth';
import { axiosAuth } from './setupAxios';

export const getUserInfo = async (): Promise<SignupReturn> => {
  const { data } = await axiosAuth('users/me');
  return data;
};
