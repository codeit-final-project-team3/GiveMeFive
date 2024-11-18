'use client';

import S from './activity.module.scss';
import ActivityInfo from './activityinfo/ActivityInfo';
import ActivityReviews from './activityreviews/ActivityReviews';
import { useEffect, useState } from 'react';
import { getAvailableSchedule } from '@/fetches/getAvailableSchedule';

export default function ActivityPage({ params }: { params: { id: string } }) {
  const [hasAvailableDates, setHasAvailableDates] = useState(true);

  useEffect(() => {
    const checkAvailableDates = async () => {
      try {
        const today = new Date(); // 오늘 날짜
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 365); // 365일 후

        // 월별 스케쥴 데이터 가져오기 및 월별 데이터 생성
        const months = [];
        const current = new Date(today);

        while (current <= endDate) {
          months.push({
            year: current.getFullYear(),
            month: current.getMonth() + 1,
          });
          current.setMonth(current.getMonth() + 1);
        }

        // 월별 스케쥴 데이터 가져오기
        const schedules = await Promise.all(
          months.map(({ year, month }) =>
            getAvailableSchedule({
              activityId: Number(params.id),
              year,
              month,
            }),
          ),
        );

        // 오늘 이후 가능한 날짜 필터링
        const availableDates = schedules.flat().filter(date => new Date(date.date) >= today);

        if (availableDates.length === 0) {
          setHasAvailableDates(false);
        }
      } catch {
        setHasAvailableDates(false);
      }
    };

    checkAvailableDates();
  }, [params.id]);

  return (
    <div className={`${S.activityPage} ${!hasAvailableDates ? S.noCalendar : ''}`}>
      <ActivityInfo params={{ id: params.id }} hasAvailableDates={hasAvailableDates} />
      <ActivityReviews params={{ id: params.id }} hasAvailableDates={hasAvailableDates} />
    </div>
  );
}
