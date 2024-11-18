'use client';

import S from './AllZoneCard.module.scss';
import Image from 'next/image';
import Star from '@/images/star-icon.svg';
import CategoryAndDropdown, { Category as CategoryType } from './category/CategoryAndDropdown';
import { useEffect, useMemo, useRef } from 'react';
import Pagination from './pagination/Pagination';
import { useActivitiesQuery } from '@/queries/useActivityQuery';
import NoActivity from '@/images/empty.svg';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { GetActivitiesResponse } from '@/fetches/activities';
import { getCurrencyFormat } from '@/utils/getCurrencyFormat';
import { useAllZoneStore, useItemsPerPage } from '@/stores/useAllZoneStore';
import { useURLManager } from '@/utils/getUrl';
import Link from 'next/link';

export default function AllZoneCard({ initialActivitiesData }: { initialActivitiesData: GetActivitiesResponse }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { updateURL } = useURLManager(router, pathname, searchParams);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  const {
    selectedSort,
    selectedCategory,
    page,
    imgError,
    setSelectedSort,
    setSelectedCategory,
    setPage,
    setImgError,
    setItemsPerPage,
    setIsSearchResult,
  } = useAllZoneStore();

  const title = useMemo(() => searchParams.get('title') || '', [searchParams]);
  const isTitleSearched = useMemo(() => title !== '', [title]);
  const itemsPerPage = useItemsPerPage();

  const { data: activitiesData, isFetched } = useActivitiesQuery(
    {
      category: selectedCategory ?? undefined,
      sort: selectedSort ? (selectedSort as 'price_asc' | 'price_desc') : 'latest',
      page,
      size: itemsPerPage,
      title: isTitleSearched ? title : undefined,
    },
    initialActivitiesData,
  );

  const totalItems = useMemo(() => activitiesData?.totalCount || 0, [activitiesData]);

  useEffect(() => {
    router.replace(pathname, { scroll: false });
    setPage(1);
    setSelectedCategory(null);
    setSelectedSort(undefined);
  }, []);

  useEffect(() => {
    setItemsPerPage(itemsPerPage);
    setIsSearchResult(isTitleSearched);
  }, [itemsPerPage, setItemsPerPage, isTitleSearched, setIsSearchResult]);

  useEffect(() => {
    setPage(1);
  }, [title, selectedCategory, selectedSort, setPage]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // 페이지 이동이나 검색이 아닌 새로고침인 경우 스크롤하지 않음
    if (!title && page === 1 && !selectedCategory && !selectedSort) {
      return;
    }

    const timer = setTimeout(() => {
      titleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedSort, page, title]);

  const handleCategoryChange = (category: CategoryType | null) => {
    setSelectedCategory(category);
    updateURL({ category, page: 1, sort: selectedSort }, { scroll: false });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort || undefined);
    updateURL({ sort: sort || undefined, page: 1, category: selectedCategory }, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage, category: selectedCategory, sort: selectedSort }, { scroll: false });
  };

  return (
    <div ref={titleRef}>
      {!isTitleSearched && (
        <>
          <CategoryAndDropdown
            selectedCategory={selectedCategory as CategoryType}
            setSelectedCategory={handleCategoryChange}
            selectedSort={selectedSort as string}
            handleSortChange={handleSortChange}
          />

          <div className={S.allExperienceContainer}>
            <span className={S.experienceText}>🛼 {selectedCategory ? `${selectedCategory} 체험` : '모든체험'}</span>
          </div>
        </>
      )}

      {isTitleSearched && (
        <div className={S.searchResultContainer}>
          <span className={S.searchResultText}>
            <span className={S.searchTerm}>{title}</span>
            (으)로 검색한 결과입니다.
          </span>
          <span className={S.searchResultCount}>총 {totalItems}개의 결과</span>
        </div>
      )}

      {isFetched && (!activitiesData || activitiesData.activities.length === 0) ? (
        <div className={S.noActivityContainer}>
          <Image src={NoActivity} alt="no activity" width={283} height={283} />
          <p className={S.noActivityText}>
            {isTitleSearched ? '검색 결과가 없습니다.' : '해당 카테고리 활동이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className={S.allZoneCardContainer}>
          {activitiesData?.activities.map(activity => (
            <Link key={activity.id} href={`/activities/${activity.id}`} className={S.allZoneCard}>
              <div className={S.allZoneCardImage}>
                {!imgError[activity.id] && (
                  <Image
                    src={activity.bannerImageUrl}
                    alt=""
                    width={283}
                    height={283}
                    className={S.allZoneCardImage}
                    onError={() => setImgError(prev => ({ ...prev, [activity.id]: true }))}
                  />
                )}
              </div>
              <div className={S.allZoneCardContent}>
                <div className={S.allZoneCardRating}>
                  <Image src={Star} alt="like" />
                  <span className={S.allZoneCardRatingText}>{activity.rating}</span>
                  <span className={S.allZoneCardReviewCount}>({activity.reviewCount})</span>
                </div>

                <div className={S.allZoneCardTitle}>{activity.title}</div>
                <div className={S.allZoneCardPrice}>
                  ₩ {getCurrencyFormat(activity.price)}
                  <span className={S.allZoneCardPriceUnit}> / 인</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {totalItems > 0 && (
        <div className={S.paginationContainer}>
          <Pagination
            onChangePage={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={page}
          />
        </div>
      )}
    </div>
  );
}
