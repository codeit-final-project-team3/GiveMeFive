import Card from './card/card';
import S from './main.module.scss';
import ArrowLeft from '../../../images/arrowleft-gray.svg';
import ArrowRight from '../../../images/arrowright-gray.svg';
import Image from 'next/image';
import Input from '../../components/@shared/input/Input';
import Button from '../../components/button/Button';
import Category from './category/category';
export default function Main() {
  return (
    <div>
      <div className={S.bannerContainer}>banner</div>

      <div className={S.mainContainer}>
        <div className={S.inputContainer}>
          <span className={S.inputText}>무엇을 체험하고 싶으신가요?</span>
          <div className={S.searchInputContainer}>
            <Input />
            <Button
              buttonColor="nomadBlack"
              textSize="lg"
              borderRadius="radius4"
              padding="padding8"
              className={S.searchButton}
            >
              검색하기
            </Button>
          </div>
        </div>

        <div className={S.bestExperienceContainer}>
          <span className={S.experienceText}>🔥 인기체험</span>
          <div className={S.experienceArrowContainer}>
            <Image src={ArrowLeft} alt="left" />
            <Image src={ArrowRight} alt="right" />
          </div>
        </div>
        <Card />

        <Category />

        <div className={S.allExperienceContainer}>
          <span className={S.experienceText}>🛼 모든체험</span>
        </div>
        <Card />
        <div>Pagination</div>
      </div>
    </div>
  );
}
