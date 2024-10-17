'use client';
import React from 'react';
import UserInfoForm from '../../components/mypage/UserInfoForm';
import SideMenu from '../../components/mypage/SideMenu';
import Footer from '../../components/@shared/footer/Footer';
import S from './myprofile.module.scss';

function Myprofile() {
  return (
    <div className={S.myprofile}>
      <div className={S.container}>
        <div className={S.sideMenuContainer}>
          <SideMenu />
        </div>
        <div className={S.formContainer}>
          <UserInfoForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Myprofile;
