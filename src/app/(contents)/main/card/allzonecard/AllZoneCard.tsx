'use client';

import S from './AllZoneCard.module.scss';
import Image from 'next/image';
import Star from '@/images/star-icon.svg';
import React from 'react';
import { useActivityStore } from '@/stores/useActivityStore';

export default function AllZoneCard() {
  const { activities } = useActivityStore();
  console.log('AllZoneCard 렌더링:', { activities });

  if (!activities || activities.length === 0) {
    return <p>표시할 활동이 없습니다.</p>;
  }

  console.log(activities);
  return (
    <div className={S.allZoneCardContainer}>
      {activities.map(activity => (
        <div key={activity.id}>
          <div className={S.allZoneCardImage}>
            <Image
              src={activity.bannerImageUrl}
              alt={activity.title}
              style={{
                borderRadius: '20px',
              }}
              width={283}
              height={283}
              className={S.allZoneCardImage}
              onError={e => {
                console.error('이미지 로드 에러:', e);
                console.log('에러가 발생한 이미지 URL:', activity.bannerImageUrl);
              }}
            />
          </div>
          <div className={S.allZoneCardContent}>
            <div className={S.allZoneCardRating}>
              <Image src={Star} alt="like" />
              <span className={S.allZoneCardRatingText}>{activity.rating}</span>
              <span className={S.allZoneCardReviewCount}>({activity.reviewCount})</span>
            </div>

            <div className={S.allZoneCardTitle}>{activity.title}</div>
            <div className={S.allZoneCardPrice}>
              {activity.price}
              <span className={S.allZoneCardPriceUnit}> / 인</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
