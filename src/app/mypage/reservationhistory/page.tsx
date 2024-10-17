'use client';
import React from 'react';
import SideMenu from '../../components/mypage/SideMenu';
import S from '../mypage.module.scss';
import Footer from '../../components/@shared/footer/Footer';

function ReservationHistory() {
  return (
    <div className={S.reservationhistory}>
      <div className={S.sidemenuContainer}>
        <SideMenu />
      </div>
    </div>
  );
}

export default ReservationHistory;
