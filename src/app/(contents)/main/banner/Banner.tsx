import S from './Banner.module.scss';
import Image from 'next/image';
import { Activity } from '@/api/activities';

interface BannerProps {
  bestActivity: Activity | null;
}

export default function Banner({ bestActivity }: BannerProps) {
  if (!bestActivity) {
    return null;
  }

  return (
    <div className={S.bannerContainer}>
      <div className={S.bannerImageWrapper}>
        {/* <div className={S.bannerImageContainer}> */}
        <Image
          src={bestActivity.bannerImageUrl}
          alt={bestActivity.title}
          className={S.bannerImage}
          width={0}
          height={550}
          objectFit="cover"
          style={{ zIndex: -1 }}
        />
        {/* </div> */}
        <div className={S.bannerContentWrapper}>
          <div className={S.bannerContent}>
            <p className={S.bannerTitle}>{bestActivity.title}</p>
            <p className={S.bannerSubtitle}>{`${new Date().getMonth() + 1}월의 인기 체험 BEST 🔥`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
