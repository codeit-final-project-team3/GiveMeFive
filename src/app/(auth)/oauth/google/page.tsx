'use client';

import { axiosInstance } from '@/fetches/setupAxios';
import { useUserStore } from '@/stores/useUserStore';
import { LoginReturn } from '@/types/auth';
import axios, { AxiosError } from 'axios';
import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

export default function RedirectGoogle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const { setUser } = useUserStore();

  useEffect(() => {
    const fetcher = async () => {
      const { data: token } = await axios.post('https://oauth2.googleapis.com/token', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/oauth/google',
        grant_type: 'authorization_code',
      });

      try {
        const { data } = await axiosInstance.post('oauth/sign-in/google', {
          redirectUri: 'http://localhost:3000/oauth/google',
          token: token.id_token,
        });
        const { user, accessToken, refreshToken } = data as LoginReturn;
        const { email, nickname, profileImageUrl } = user;
        setUser({ email, nickname, profileImageUrl });
        setCookie('accessToken', accessToken);
        setCookie('refreshToken', refreshToken);
        router.replace('/');
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 403) {
            const { data } = await axiosInstance.post('oauth/sign-up/google', {
              nickname: '',
              redirectUri: 'http://localhost:3000/oauth/google',
              token: token.id_token,
            });
            const { user, accessToken, refreshToken } = data as LoginReturn;
            const { email, nickname, profileImageUrl } = user;
            setUser({ email, nickname, profileImageUrl });
            setCookie('accessToken', accessToken);
            setCookie('refreshToken', refreshToken);
            router.replace('/');
          }
        }
      }
    };

    fetcher();
  }, []);
  return <div>RedirectGoogle</div>;
}
