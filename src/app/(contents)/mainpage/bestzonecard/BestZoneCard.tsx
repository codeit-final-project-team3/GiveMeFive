'use client';

import S from './BestZoneCard.module.scss';
import Image from 'next/image';
import Star from '@/images/star-icon.svg';
import { useState, useEffect, useMemo } from 'react';
import ArrowButton from './arrowButton/ArrowButton';
import { useBestActivitiesQuery } from '@/queries/useActivityQuery';
import { useRouter, useSearchParams } from 'next/navigation';
import { GetActivitiesResponse } from '@/fetches/activities';
import { getCurrencyFormat } from '@/utils/getCurrencyFormat';

export default function BestZoneCard({
  initialBestActivitiesData,
}: {
  initialBestActivitiesData: GetActivitiesResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const size = isWideScreen ? 3 : 20; // 와이드스크린일 때 3개, 아닐 때 20개
  const { data: bestActivitiesData, isFetched } = useBestActivitiesQuery(Number(page), size, initialBestActivitiesData);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const hasTitle = useMemo(() => searchParams.get('title'), [searchParams]);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const newIsWideScreen = window.innerWidth >= 1024; // 임시로 1024px 이상일 때 와이드스크린으로 판단
      setIsWideScreen(newIsWideScreen);
      // 화면 크기가 변경될 때 페이지를 1로 리셋
      if (newIsWideScreen !== isWideScreen) {
        setPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isWideScreen]);

  // 활동이 없으면 표시하지 않음
  if (isFetched && (!bestActivitiesData?.activities || bestActivitiesData?.activities.length === 0)) {
    return <p>표시할 활동이 없습니다.</p>;
  }
  if (hasTitle) {
    return null;
  }

  return (
    <div>
      <div className={S.bestExperienceContainer}>
        <span className={S.experienceText}>🔥 인기체험</span>
        {isWideScreen && (
          <div className={S.experienceArrowContainer}>
            <ArrowButton page={page} setPage={setPage} totalItems={bestActivitiesData?.totalCount || 0} size={3} />
          </div>
        )}
      </div>

      <div className={S.bestZoneCardContainer}>
        {bestActivitiesData?.activities.map(activity => (
          <div key={activity.id} className={S.bestZoneCard} onClick={() => router.push(`/activities/${activity.id}`)}>
            <div className={S.bestZoneCardImage}>
              {!imgError[activity.id] && (
                <Image
                  src={activity.bannerImageUrl}
                  alt=""
                  width={384}
                  height={384}
                  className={S.bestZoneCardImage}
                  onError={() => setImgError(prev => ({ ...prev, [activity.id]: true }))}
                />
              )}

              <div className={S.bestZoneCardContent}>
                <div className={S.bestZoneCardRating}>
                  <Image src={Star} alt="like" />
                  <span className={S.bestZoneCardRatingText}>
                    {activity.rating} ({activity.reviewCount})
                  </span>
                </div>

                <div className={S.bestZoneCardTitle}>{activity.title}</div>
                <div className={S.bestZoneCardPrice}>
                  ₩ {getCurrencyFormat(activity.price)}
                  <span className={S.bestZoneCardPriceUnit}> / 인</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
