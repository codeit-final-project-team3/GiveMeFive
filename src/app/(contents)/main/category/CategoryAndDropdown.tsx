import S from './CategoryAndDropdown.module.scss';
import Dropdown from '../../../components/@shared/dropdown/Dropdown';
import useDropdown from '@/hooks/useDropdown';

export type Category = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
const categoryList: Category[] = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

export type Sort = 'price_asc' | 'price_desc';
const sortList: Sort[] = ['price_asc', 'price_desc'];
interface CategoryProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedSort: string;
  handleSortChange: (value: string) => void;
}

export default function CategoryAndDropdown({
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  handleSortChange,
}: CategoryProps) {
  const dropdownList = sortList.map(sort => (sort === 'price_asc' ? '가격이 낮은 순' : '가격이 높은 순'));
  const { toggleDropdown, isDropdownToggle } = useDropdown(dropdownList);

  // const displayValue = selectedValue || '가격';

  const handleDropdownChange = (value: string) => {
    const sortValue = value === '가격이 낮은 순' ? 'price_asc' : 'price_desc';
    handleSortChange(sortValue);
  };

  const displayValue =
    selectedSort === 'price_asc' ? '가격이 낮은 순' : selectedSort === 'price_desc' ? '가격이 높은 순' : '가격';

  return (
    <div className={S.categoryDropdownContainer}>
      <div className={S.categoryContainer}>
        {categoryList.map(category => (
          <button
            key={category}
            className={`${S.category} ${selectedCategory === category ? S.selected : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={S.dropdownContainer}>
        <Dropdown
          data={dropdownList}
          onChange={handleDropdownChange}
          type="default"
          isDropdownToggle={isDropdownToggle}
          toggleDropdown={toggleDropdown}
          selectedValue={displayValue}
        />
      </div>
    </div>
  );
}
