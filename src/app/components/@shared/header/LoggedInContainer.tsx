import Image from 'next/image';
import S from './LoggedInContainer.module.scss';
import defaultProfileImg from '@/images/profiles/default-profile.svg';
import notificationIcon from '@/images/icons/Icon-notification.svg';

interface LoggedInContainerProps {
  profileImageUrl: string | null;
  nickname: string;
  logout: () => void;
}

export default function LoggedInContainer({ profileImageUrl, nickname }: LoggedInContainerProps) {
  return (
    <div className={S.loggedInContainer}>
      <button className={S.notification}>
        <Image src={notificationIcon} alt="프로필 이미지" width={20} height={20} />
      </button>
      <article className={S.verticalSeparator} />
      <div className={S.profileContainer}>
        <Image src={profileImageUrl || defaultProfileImg} alt="프로필 이미지" width={32} height={32} priority />
        <p className={S.nickname}>{nickname}</p>
      </div>
    </div>
  );
}
