import React from 'react';
import S from './MyExperienceManagementCard.module.scss';
import Dropdown from '../../components/@shared/dropdown/Dropdown';
import useDropdown from '../../../hooks/useDropdown';

interface Experience {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

interface MyExperienceManagementCardProps {
  experience: Experience;
}

const MyExperienceManagementCard: React.FC<MyExperienceManagementCardProps> = ({ experience }) => {
  const actionList = ['수정하기', '삭제하기'];
  const { onDropdownChange, data, toggleDropdown, isDropdownToggle } = useDropdown(actionList);

  const handleActionSelect = (action: string) => {
    toggleDropdown(); // 액션을 선택할 때 드롭다운을 닫기
    if (action === '수정하기') {
      // 수정하기 로직 추가
      console.log('수정하기 클릭');
    } else if (action === '삭제하기') {
      // 삭제하기 로직 추가
      console.log('삭제하기 클릭');
    }
  };

  return (
    <div className={S.card}>
      <img src={experience.bannerImageUrl} alt={experience.title} className={S.image} />
      <div className={S.info}>
        <div className={S.rating}>
          ⭐ {experience.rating} ({experience.reviewCount})
        </div>
        <div className={S.title}>{experience.title}</div>
        <div className={S.price}>₩{experience.price.toLocaleString()}</div>
      </div>
      <div className={S.actions}>
        <Dropdown
          data={data}
          onChange={handleActionSelect}
          isDropdownToggle={isDropdownToggle}
          toggleDropdown={toggleDropdown}
          type="kebab"
        />
      </div>
    </div>
  );
};

export default MyExperienceManagementCard;
