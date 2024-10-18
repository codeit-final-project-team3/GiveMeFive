'use client';
import React from 'react';
import SideMenu from '../../components/mypage/SideMenu';
import MyExperienceManagementList from '../../components/mypage/MyExperienceManagementList';
import Footer from '../../components/@shared/footer/Footer';
import S from './myexperiencemanagement.module.scss';
import Button from '../../components/@shared/button/Button';
import { Title } from '@mantine/core';

function MyExperienceManagement() {
  return (
    <div className={S.myExperienceManagement}>
      <div className={S.container}>
        <div className={S.sideMenuContainer}>
          <SideMenu />
        </div>
        <div className={S.contentContainer}>
          <div className={S.header}>
            <Title order={2} className={S.title}>
              내 체험 관리
            </Title>
            <Button
              buttonColor="nomadBlack"
              textSize="lg"
              borderRadius="radius6"
              padding="padding14"
              className={S.submitButton}
              type="submit"
            >
              체험 등록하기
            </Button>
          </div>
          <MyExperienceManagementList />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyExperienceManagement;
