'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import S from './SideMenu.module.scss';
import Image from 'next/image';
import MyProfileIcon from '@/images/sidemenuIcon/myprofile-Icon.svg';
import ReservationHistoryIcon from '@/images/sidemenuIcon/reservationhistory-Icon.svg';
import MyExperienceManagementIcon from '@/images/sidemenuIcon/myexperiencemanagement-Icon.svg';
import ReservationStatusIcon from '@/images/sidemenuIcon/reservationstatus-Icon.svg';
import ProfileButtonIcon from '@/images/sidemenuIcon/profile-button-icon.svg';
import ProfileImage from '@/images/sidemenuIcon/profile-image.svg';

const SideMenu: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className={S.sideMenu}>
      <div className={S.profileContainer}>
        <Image src={ProfileImage} alt="Profile" className={S.profileImage} />
        <div className={S.editIcon}>
          <Image src={ProfileButtonIcon} alt="Edit Profile" className={S.editButtonIcon} />
        </div>
      </div>
      <nav className={S.menu}>
        <ul>
          <li className={pathname === '/mypage/myprofile' ? S.active : ''}>
            <Link href="/mypage/myprofile">
              <Image src={MyProfileIcon} alt="My Profile" className={S.menuIcon} />내 정보
            </Link>
          </li>
          <li className={pathname === '/mypage/reservationhistory' ? S.active : ''}>
            <Link href="/mypage/reservationhistory">
              <Image src={ReservationHistoryIcon} alt="Reservation History" className={S.menuIcon} />
              예약 내역
            </Link>
          </li>
          <li className={pathname === '/mypage/myexperiencemanagement' ? S.active : ''}>
            <Link href="/mypage/myexperiencemanagement">
              <Image src={MyExperienceManagementIcon} alt="My Experience Management" className={S.menuIcon} />내 체험
              관리
            </Link>
          </li>
          <li className={pathname === '/mypage/reservationstatus' ? S.active : ''}>
            <Link href="/mypage/reservationstatus">
              <Image src={ReservationStatusIcon} alt="Reservation Status" className={S.menuIcon} />
              예약 현황
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
