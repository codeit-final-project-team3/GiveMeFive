'use client';

import Image from 'next/image';
import S from './Header.module.scss';
import logoImg from '@/images/logos/logo-md.svg';
import Link from 'next/link';

import { useUserStore } from '@/stores/useUserStore';
import { useEffect } from 'react';
import { useUserQuery } from '@/queries/useUserQuery';
import LoggedInContainer from './LoggedInContainer';

export default function Header() {
  const { data: user, isError } = useUserQuery();
  const { logout, setUser } = useUserStore();

  // 이전에 로그아웃을 하지 않고, 사이트에 재접속 한 경우
  // 유저 정보는 로컬 스토리지에,
  // accessToken, refreshToken은 쿠키에 그대로 남아있다.
  // 이를 그대로 사용하게 되면 그 사이에 유저 정보가 바뀌었거나,
  // accessToken이 만료되었을 수 있으므로 유저 정보를 업데이트하는 과정이 필요함
  useEffect(() => {
    if (user) {
      // 새로 유저 정보를 받아왔으므로 전역 상태 업데이트
      const { email, nickname, profileImageUrl } = user;
      setUser({ email, nickname, profileImageUrl });
    }
    if (isError) {
      // 리프레시 토큰 만료 등의 이유로, 유저 데이터를 받아오지 못한다면 로그아웃
      logout();
    }
  }, [user, isError]);

  return (
    <header className={S.headerContainer}>
      <div className={S.headerContents}>
        <Link href="/" className={S.headerLogo}>
          <Image src={logoImg} alt="로고 이미지" width={172} height={30} priority />
        </Link>
        {user ? (
          <LoggedInContainer nickname={user.nickname} profileImageUrl={user.profileImageUrl} logout={logout} />
        ) : (
          <div className={S.notLoggedInContainer}>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </div>
        )}
      </div>
    </header>
  );
}
