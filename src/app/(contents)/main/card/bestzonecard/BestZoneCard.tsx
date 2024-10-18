'use client';

import S from './BestZoneCard.module.scss';
import Image from 'next/image';
import Star from '@/images/star-icon.svg';
import React from 'react';
import { useActivityStore } from '@/stores/useActivityStore';

export default function BestZoneCard() {
  const { activities } = useActivityStore();
  console.log('BestZoneCard 렌더링:', { activities });

  if (!activities || activities.length === 0) {
    return <p>표시할 활동이 없습니다.</p>;
  }

  console.log(activities);

  return (
    <div className={S.bestZoneCardContainer}>
      {activities.map(activity => (
        <div key={activity.id} className={S.bestZoneCard}>
          <div className={S.bestZoneCardImage}>
            <Image
              src={activity.bannerImageUrl}
              alt={activity.title}
              width={384}
              height={384}
              className={S.bestZoneCardImage}
              onError={e => {
                console.error('이미지 로드 에러:', e);
                console.log('에러가 발생한 이미지 URL:', activity.bannerImageUrl);
              }}
            />

            <div className={S.bestZoneCardContent}>
              <div className={S.bestZoneCardRating}>
                <Image src={Star} alt="like" />
                <span className={S.bestZoneCardRatingText}>
                  {activity.rating} ({activity.reviewCount})
                </span>
              </div>

              <div className={S.bestZoneCardTitle}>{activity.title}</div>
              <div className={S.bestZoneCardPrice}>
                ₩ {Number(activity.price).toLocaleString()}
                <span className={S.bestZoneCardPriceUnit}> / 인</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
