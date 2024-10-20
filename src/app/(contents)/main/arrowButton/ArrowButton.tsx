import S from './ArrowButton.module.scss';
import ArrowLeftGray from '../../../../images/arrowleft-gray.svg';
import ArrowLeftBlack from '../../../../images/arrowleft-black.svg';
import ArrowRightGray from '../../../../images/arrowright-gray.svg';
import ArrowRightBlack from '../../../../images/arrowright-black.svg';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActivityStore } from '@/stores/useActivityStore';

export default function ArrowButton() {
  const getBestActivities = useActivityStore(state => state.getBestActivities);
  const bestActivitiesResponse = useActivityStore(state => state.bestActivitiesResponse);
  const [page, setPage] = useState(1);

  const totalPage = useMemo(() => {
    return Math.ceil(bestActivitiesResponse.totalCount / 3);
  }, [bestActivitiesResponse.totalCount]);

  useEffect(() => {
    getBestActivities(page);
  }, [page]);

  const onClickBtn = useCallback(
    (type: 'left' | 'right') => {
      if (type === 'left') {
        setPage(prev => {
          if (prev === 1) {
            return totalPage;
          }
          return prev - 1;
        });
      } else {
        setPage(prev => {
          if (prev === totalPage) {
            return 1;
          }
          return prev + 1;
        });
      }
    },
    [totalPage],
  );

  const disabled = useMemo(() => {
    return (bestActivitiesResponse.totalCount || 0) <= 3;
  }, [bestActivitiesResponse.totalCount]);

  return (
    <div className={S.arrowButtonContainer}>
      {disabled}
      <button className={S.arrowButton} onClick={() => onClickBtn('left')}>
        <Image src={disabled ? ArrowLeftGray : ArrowLeftBlack} alt="left" />
      </button>
      <button className={S.arrowButton} onClick={() => onClickBtn('right')}>
        <Image src={disabled ? ArrowRightGray : ArrowRightBlack} alt="right" />
      </button>
    </div>
  );
}
