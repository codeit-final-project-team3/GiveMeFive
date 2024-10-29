'use client';

import S from './AllZoneCard.module.scss';
import Image from 'next/image';
import Star from '@/images/star-icon.svg';
import CategoryAndDropdown, { Category as CategoryType } from './category/CategoryAndDropdown';
import { useState, useEffect, useMemo } from 'react';
import Pagination from './pagination/Pagination';
import { useActivitiesQuery } from '@/queries/useActivityQuery';
import NoActivity from '@/images/empty.svg';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { GetActivitiesResponse } from '@/fetches/activities';
import { getCurrencyFormat } from '@/utils/getCurrencyFormat';

export default function AllZoneCard({ initialActivitiesData }: { initialActivitiesData: GetActivitiesResponse }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedSort, setSelectedSort] = useState<string | undefined>(searchParams.get('sort') || undefined);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    (searchParams.get('category') as CategoryType) || null,
  );
  const [page, setPage] = useState(() => {
    const page = searchParams.get('page');
    try {
      return page ? parseInt(page, 10) : 1;
    } catch (error) {
      return 1;
    }
  });
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const title = useMemo(() => searchParams.get('title') || '', [searchParams]);
  const isTitleSearched = useMemo(() => title !== '', [title]);
  const itemsPerPage = useMemo(() => (isTitleSearched ? 16 : 8), [isTitleSearched]);

  const { data: activitiesData, isFetched } = useActivitiesQuery(
    {
      category: selectedCategory ?? undefined,
      sort: selectedSort as 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest',
      page,
      size: itemsPerPage,
      method: 'offset',
      title,
    },
    initialActivitiesData,
  );

  const totalItems = useMemo(() => activitiesData?.totalCount || 0, [activitiesData]);

  useEffect(() => {
    setPage(1);
  }, [title, selectedCategory, selectedSort]);

  const updateURL = (params: { page?: number; category?: CategoryType | null; sort?: string }) => {
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value != null));

    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(validParams).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleCategoryChange = (category: CategoryType | null) => {
    setSelectedCategory(category);
    setPage(1);
    updateURL({
      category,
      page: 1,
      sort: selectedSort,
    });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setPage(1);
    updateURL({
      sort,
      page: 1,
      category: selectedCategory,
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL({
      page: newPage,
      category: selectedCategory,
      sort: selectedSort,
    });
  };

  return (
    <div>
      {!isTitleSearched && (
        <>
          <CategoryAndDropdown
            selectedCategory={selectedCategory as CategoryType}
            setSelectedCategory={handleCategoryChange}
            selectedSort={selectedSort as string}
            handleSortChange={handleSortChange}
          />

          <div className={S.allExperienceContainer}>
            <span className={S.experienceText}>🛼 모든체험</span>
          </div>
        </>
      )}

      {isTitleSearched && (
        <div className={S.searchResultContainer}>
          <span className={S.searchResultText}>
            <span className={S.searchTerm}>{title}</span>
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
            <div key={activity.id} onClick={() => router.push(`/activities/${activity.id}`)}>
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
            </div>
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
