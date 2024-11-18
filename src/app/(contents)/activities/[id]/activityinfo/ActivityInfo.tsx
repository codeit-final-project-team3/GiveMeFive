'use client';

import S from './ActivityInfo.module.scss';
import star from '@/images/star-icon.svg';
import location from '@/images/location.svg';
import left from '@/images/arrow-left.svg';
import right from '@/images/arrow-right.svg';
import Image from 'next/image';
import Dropdown from '@/app/components/@shared/dropdown/Dropdown';
import useDropdown from '@/hooks/useDropdown';
import Map from './map';
import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import ResponsiveReservation from '@/app/components/reservation/ResponsiveReservation';
import Alert from '@/app/components/@shared/modal/AlertModal';
import { useRouter } from 'next/navigation';
import { useDetailActivitiesQuery } from '@/queries/useActivityInfoQuery';
import { deleteMyActivity } from '@/fetches/myActivities';
import copy from '@/images/copy-icon.png';
import { useActivityStore } from '@/stores/useActivityStore';
import { useToastStore } from '@/stores/useToastStore';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ActivityInfo({
  params,
  hasAvailableDates,
}: {
  params: { id: string };
  hasAvailableDates: boolean;
}) {
  const activityId = Number(params.id);
  const { data: activity } = useDetailActivitiesQuery(activityId);
  const {
    currentImageIndex,
    setCurrentImageIndex,
    allImages,
    setAllImages,
    isAlertOpen,
    setIsAlertOpen,
    isErrorAlertOpen,
    setIsErrorAlertOpen,
    errorMessage,
    setErrorMessage,
  } = useActivityStore();

  const dropdownList = ['수정하기', '삭제하기'];
  const router = useRouter();
  const { toggleDropdown, isDropdownToggle } = useDropdown(dropdownList);
  const { addToast } = useToastStore(state => state.action);

  useEffect(() => {
    const images = [activity?.bannerImageUrl, ...(activity?.subImages?.map(img => img.imageUrl) || [])].filter(
      Boolean,
    ) as string[];
    setAllImages(images);
  }, [activity]);

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length);
  };

  const user = useUserStore(state => state.user);
  const isCreator = user && user.id === activity?.userId;

  const handleActionSelect = (action: string) => {
    toggleDropdown();
    if (action === '수정하기') {
      router.push(`/editactivities/${activityId}`);
    } else if (action === '삭제하기') {
      setIsAlertOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMyActivity(activityId);
      router.push('/');
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      setErrorMessage(err.response?.data?.message || '삭제에 실패했습니다.');
      setIsErrorAlertOpen(true);
      setIsAlertOpen(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({ message: '체험이 복사되었습니다.', type: 'success' });
  };

  return (
    <>
      <div className={S.activityInfo}>
        <div className={S.categoryAndTitleContainer}>
          <div className={S.categoryAndTitle}>
            <div className={S.category}>{activity?.category}</div>
            <div className={S.title}>
              {activity?.title}
              <div className={S.copyIcon} onClick={handleCopy}>
                <Image src={copy} width={16} height={16} alt="복사" />
              </div>
              {!hasAvailableDates && <span className={S.noDateWarning}>예약 가능한 날짜가 없습니다.</span>}
            </div>
          </div>

          <div className={S.ratingAndAddressContainer}>
            <div className={S.ratingContainer}>
              <Image src={star} alt="" width={16} height={16} />

              <div className={S.rating}>
                {activity?.rating} ({activity?.reviewCount})
              </div>
            </div>

            <div className={S.locationContainer}>
              <Image src={location} alt="" width={18} height={18} />
              <div className={S.address}>{activity?.address}</div>
            </div>
          </div>
        </div>
        {isCreator && (
          <div className={S.dropdownWrapper}>
            <Dropdown
              type="kebab"
              data={dropdownList}
              onChange={handleActionSelect}
              toggleDropdown={toggleDropdown}
              isDropdownToggle={isDropdownToggle}
            />
          </div>
        )}
      </div>

      <div className={S.imageContainer}>
        <div className={S.mainImageContainer}>
          {allImages[currentImageIndex] && (
            <Image src={allImages[currentImageIndex]} alt="" layout="fill" objectFit="cover" />
          )}
          {allImages.length > 1 && (
            <div className={S.imageNavigation}>
              <button onClick={prevImage} className={S.navButton}>
                <Image src={left} alt="" width={24} height={47} />
              </button>
              <button onClick={nextImage} className={S.navButton}>
                <Image src={right} alt="" width={24} height={47} />
              </button>
            </div>
          )}
        </div>
        {allImages.length > 1 && (
          <div className={`${S.subImagesContainer} ${S[`subImageCount${Math.min(allImages.length - 1, 4)}`]}`}>
            {allImages.slice(1, 5).map(
              (image, index) =>
                image && (
                  <div key={index} className={S.subImage}>
                    <Image src={image} alt={`서브 이미지 ${index + 1}`} layout="fill" objectFit="cover" />
                  </div>
                ),
            )}
          </div>
        )}
      </div>

      <div className={S.calendarAndInfoContainer}>
        <div className={S.introductionAndMapContainer}>
          <div className={S.introductionContainerWrapper}>
            <hr className={S.hr} />
          </div>
          <div className={S.introductionContainer}>
            <span className={S.activityDescription}>체험 설명</span>
            <div className={S.description}>{activity?.description}</div>
          </div>
          <hr className={S.hr} />
          <div className={S.mapContainer}>
            <div className={S.map}>{activity?.address && <Map address={activity.address} />} </div>

            <div className={S.locationContainer}>
              <Image src={location} alt="" width={18} height={18} />
              <span className={S.address}>{activity?.address}</span>
            </div>
          </div>
          <div className={S.introductionContainerWrapper}>
            <hr className={S.hr} />
          </div>
        </div>
        {!isCreator && hasAvailableDates && (
          <ResponsiveReservation activityId={activityId} price={activity?.price || 0} />
        )}
      </div>
      <Alert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onAlert={handleDelete}
        message="이 체험을 삭제하시겠습니까?"
        alertButtonText="삭제"
      />
      <Alert
        isOpen={isErrorAlertOpen}
        onClose={() => setIsErrorAlertOpen(false)}
        onAlert={async () => setIsErrorAlertOpen(false)}
        message={errorMessage}
        alertButtonText="확인"
      />
    </>
  );
}
