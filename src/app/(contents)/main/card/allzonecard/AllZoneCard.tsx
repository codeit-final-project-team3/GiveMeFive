'use client';

import S from './AllZoneCard.module.scss';
import Image from 'next/image';
import Star from '@/images/star-icon.svg';
import React from 'react';
import { useActivityStore } from '@/stores/useActivityStore';

export default function AllZoneCard() {
  const activitiesResponse = useActivityStore(state => state.activitiesResponse);

  if (!activitiesResponse.activities || activitiesResponse.activities.length === 0) {
    return <p>표시할 활동이 없습니다.</p>;
  }

  return (
    <div className={S.allZoneCardContainer}>
      {activitiesResponse.activities.map(activity => (
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
              ₩ {Number(activity.price).toLocaleString()} <span className={S.allZoneCardPriceUnit}> / 인</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
