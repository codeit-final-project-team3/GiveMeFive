import { USERS_QUERY_KEY } from '@/constants/queryKeys';
import { getUserInfo } from '@/fetches/getUserInfo';
import { getTokens } from '@/utils/getTokens';
import { useQuery } from '@tanstack/react-query';

export const useUserQuery = () => {
  // 로그인, 로그아웃 등 accessToken의 변화는 유저 정보의 변화를 의미하므로
  // 화면이 리렌더링되어야 함
  const { accessToken } = getTokens();
  return useQuery({
    queryKey: [USERS_QUERY_KEY, accessToken],
    queryFn: getUserInfo,
    retry: 0, // 엑세스 토큰이 없거나 만료된 경우, 내 정보 요청 시도 -> 실패 ->  토큰 재발급 -> 실패 이므로 이미 2번의 시도를 하기 때문에 굳이 재시도할 필요 없음
  });
};
