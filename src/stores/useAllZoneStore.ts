import { create } from 'zustand';
import { Category } from '@/app/(contents)/mainpage/allzonecard/category/CategoryAndDropdown';
import { useMediaQuery } from '@mantine/hooks';

interface AllZoneState {
  selectedSort: string | undefined;
  selectedCategory: Category | null;
  page: number;
  imgError: Record<number, boolean>;
  itemsPerPage: number;
  isSearchResult: boolean;

  setSelectedSort: (sort: string | undefined) => void;
  setSelectedCategory: (category: Category | null) => void;
  setPage: (page: number) => void;
  setImgError: (value: Record<number, boolean> | ((prev: Record<number, boolean>) => Record<number, boolean>)) => void;
  resetState: () => void;
  setItemsPerPage: (count: number) => void;
  setIsSearchResult: (value: boolean) => void;
}

const initialState = {
  selectedSort: undefined,
  selectedCategory: null,
  page: 1,
  imgError: {},
  itemsPerPage: 0,
  isSearchResult: false,
};

export const useAllZoneStore = create<AllZoneState>(set => ({
  ...initialState,

  setSelectedSort: sort => set({ selectedSort: sort }),
  setSelectedCategory: category => set({ selectedCategory: category }),
  setPage: page => set({ page }),
  setImgError: value =>
    set(state => ({
      imgError: typeof value === 'function' ? value(state.imgError) : value,
    })),
  resetState: () => set(initialState),
  setItemsPerPage: count => set({ itemsPerPage: count }),
  setIsSearchResult: value => set({ isSearchResult: value }),
}));

export const useItemsPerPage = () => {
  const isDesktop = useMediaQuery('(min-width: 1201px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isSearchResult = useAllZoneStore(state => state.isSearchResult);

  // 검색 결과
  if (isSearchResult) {
    if (isDesktop) {
      return 16;
    }
    if (isTablet) {
      return 9;
    }
    return 8;
  }

  // 일반 목록
  if (isDesktop) {
    return 8;
  }
  if (isTablet) {
    return 9;
  }
  return 6;
};
