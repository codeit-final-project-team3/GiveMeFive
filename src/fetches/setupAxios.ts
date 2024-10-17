import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// 요청 interceptor
axiosAuth.interceptors.request.use(config => {
  const accessToken = getCookie('accessToken');

  // accessToken이 없다면 그대로 전송
  if (!accessToken) {
    return config;
  }

  // accessToken이 있다면 header authorization에 담아서 전송
  config.headers.authorization = `Bearer ${accessToken}`;
  return config;
});

// 응답 interceptor
axiosAuth.interceptors.response.use(
  response => {
    // 응답이 올바르게 온다면 그대로 return
    return response;
  },
  async error => {
    // 에러가 발생한다면 경우에 따라 refreshToken으로 accessToken을 재발급 받아 다시 요청
    const {
      config,
      response: { status },
    } = error;

    // 기존 요청 저장
    const originalRequest = config;

    // unauthorize 일 경우
    if (status === 401 && error.response.data.message === 'Unauthorized') {
      const refreshToken = getCookie('refreshToken');
      // 토큰 재발급 요청
      const { data } = await axiosInstance.post(
        '/auth/tokens',
        {},
        { headers: { authorization: `Bearer ${refreshToken}` } },
      );

      // 재발급된 token으로 쿠키 업데이트
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;
      setCookie('accessToken', newAccessToken);
      setCookie('refreshToken', newRefreshToken);

      // 401로 실패했던 요청을 새로운 accessToken으로 재요청
      originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    }

    // Token 문제 외의 다른 문제일 경우 그대로 진행
    return axios(originalRequest);
  },
);
