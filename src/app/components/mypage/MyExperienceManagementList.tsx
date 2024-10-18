// MyExperienceManagementList.tsx
import React, { useEffect, useState } from 'react';
import MyExperienceManagementCard from './MyExperienceManagementCard';
import S from './MyExperienceManagementList.module.scss';

interface Experience {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

const MyExperienceManagementList: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 API 호출 대신, 예시 데이터 사용
        const data = {
          activities: [
            {
              id: 2933,
              userId: 1150,
              title: '함께 배우면 즐거운 오페라',
              description: '바그너 렛츠고',
              category: '투어',
              price: 10000,
              address: '서울특별시 강남구 테헤란로 427',
              bannerImageUrl:
                'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/8-3_1150_1729250287355.webp',
              rating: 5,
              reviewCount: 2222,
              createdAt: '2024-10-18T16:30:50.604Z',
              updatedAt: '2024-10-18T16:30:50.604Z',
            },
            {
              id: 2932,
              userId: 1150,
              title: '함께 배우면 즐거운 일본어',
              description: '곤니치와',
              category: '투어',
              price: 10000,
              address: '서울특별시 강남구 테헤란로 427',
              bannerImageUrl:
                'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/8-3_1150_1729250287355.webp',
              rating: 4.4,
              reviewCount: 54,
              createdAt: '2024-10-18T16:27:21.772Z',
              updatedAt: '2024-10-18T16:27:21.772Z',
            },
            {
              id: 2931,
              userId: 1150,
              title: '함께 배우면 즐거운 발레',
              description: '휘리리릭',
              category: '투어',
              price: 10000,
              address: '서울특별시 강남구 테헤란로 427',
              bannerImageUrl:
                'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/8-3_1150_1729250287355.webp',
              rating: 1.2,
              reviewCount: 9999,
              createdAt: '2024-10-18T16:26:51.777Z',
              updatedAt: '2024-10-18T16:26:51.777Z',
            },
          ],
          totalCount: 3,
          cursorId: null,
        };

        setExperiences(data.activities);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={S.list}>
      {experiences.map(experience => (
        <MyExperienceManagementCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
};

export default MyExperienceManagementList;
