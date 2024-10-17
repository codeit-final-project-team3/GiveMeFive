import React from 'react';
import SideMenu from '../../components/mypage/SideMenu';
import Footer from '../../components/@shared/footer/Footer';
import S from '../mypage.module.scss';

function MyExperiencemanagement() {
  return (
    <div className={S.myexperiencemanagement}>
      <div className={S.sideMenuContainer}>
        <SideMenu />
      </div>
    </div>
  );
}

export default MyExperiencemanagement;
