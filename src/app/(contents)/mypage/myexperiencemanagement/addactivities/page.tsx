'use client';
import AddActivitiesForm from '../../../../components/addActivities/addActivitiesForm/AddActivitiesForm';
import React from 'react';
import SideMenu from '../../../../components/mypage/SideMenu';
import S from './AddActivities.module.scss';

function AddActivities() {
  return (
    <div className={S.myprofile}>
      <div className={S.container}>
        <div className={S.sideMenuContainer}>
          <SideMenu />
        </div>
        <div className={S.formContainer}>
          <AddActivitiesForm />
        </div>
      </div>
    </div>
  );
}

export default AddActivities;
