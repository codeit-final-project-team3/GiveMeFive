import dayjs from 'dayjs';
import { Tabs } from '@mantine/core';
import { ReservationCount } from '../ReservationInfoModal/ReservationInfoModal';
import BackDrop from '../../@shared/backdrop/BackDrop';
import { GetReservedScheduleResponse, getReservedSelectSchedule, Reservation } from '@/fetches/getReservationDashboard';
import { useEffect, useState } from 'react';
import ReservationCard from '../ReservationCard/ReservationCard';
import S from './ReservationInfoTabs.module.scss';
import Dropdown from '../../@shared/dropdown/Dropdown';
import useDropdown from '@/hooks/useDropdown';

interface ReservationInfoTabsProps {
  reservationCount?: ReservationCount;
  onClose: () => void;
  activityId: number;
  selectedDate: Date;
  setIsToggleTrigger: (value: boolean) => void;
  isToggleTrigger: boolean;
  scheduleData?: string[];
  scheduleKey?: number[];
  setSelectedIndex: (index: number) => void;
}

export default function ReservationInfoTabs({
  reservationCount,
  onClose,
  activityId,
  selectedDate,
  setIsToggleTrigger,
  isToggleTrigger,
  scheduleData,
  scheduleKey,
  setSelectedIndex,
}: ReservationInfoTabsProps) {
  const [selectStatus, setSelectStatus] = useState<'pending' | 'declined' | 'confirmed'>('pending');
  const [data, setData] = useState<Reservation[]>();
  const [dropdownScheduleData, setDropdownScheduleData] = useState<string[]>(['스케쥴을 선택해 주세요']);
  const [dropdownScheduleKey, setDropdownScheduleKey] = useState<number[]>([]);
  const {
    data: dropdownItems,
    onDropdownChange,
    toggleDropdown,
    isDropdownToggle,
    selectedValue,
    selectedKey,
    selectedIndex,
  } = useDropdown(dropdownScheduleData, dropdownScheduleKey);

  const formattedDate = dayjs(new Date(selectedDate)).format('YYYY년MM월DD일');
  const onTabChange = (value: string | null) => {
    if (value === 'pending' || value === 'declined' || value === 'confirmed') {
      setSelectStatus(value as 'pending' | 'declined' | 'confirmed');
    }
  };

  const getSelectStatusInfo = async (selectStatus: 'pending' | 'declined' | 'confirmed') => {
    const response = await getReservedSelectSchedule({ activityId, selectScheduleId: selectedKey, selectStatus });
    console.log(response, '지정한 status 반환값');
    console.log(response.reservations);
    setData(response.reservations);
  };

  useEffect(() => {
    getSelectStatusInfo(selectStatus);
  }, [selectStatus, selectedKey, isToggleTrigger]);

  useEffect(() => {
    if (scheduleData && scheduleKey) {
      setDropdownScheduleData(scheduleData);
      setDropdownScheduleKey(scheduleKey);
    }
  }, [scheduleData, scheduleKey]);

  useEffect(() => {
    setSelectedIndex(selectedIndex);
  }, [selectedIndex]);

  return (
    <div>
      {/* <BackDrop onClose={onClose} /> */}
      <Tabs color="#112211" defaultValue="pending" onChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab value="pending">신청 {reservationCount?.pending}</Tabs.Tab>
          <Tabs.Tab value="confirmed">승인 {reservationCount?.confirmed}</Tabs.Tab>
          <Tabs.Tab value="declined">거절 {reservationCount?.declined}</Tabs.Tab>
        </Tabs.List>
        <div>예약 날짜</div>
        <div>{formattedDate}</div>
        <Dropdown
          type="category"
          data={dropdownItems}
          onChange={onDropdownChange}
          isDropdownToggle={isDropdownToggle}
          toggleDropdown={toggleDropdown}
          selectedValue={selectedValue}
        />
        <div>예약 내역</div>
        <Tabs.Panel value="pending">
          <div className={S.CardWrapper}>
            {data && data.length > 0 ? (
              data.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  setIsToggleTrigger={setIsToggleTrigger}
                  isToggleTrigger={isToggleTrigger}
                />
              ))
            ) : (
              <div>예약 내역이 없습니다.</div>
            )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="confirmed">
          <div className={S.CardWrapper}>
            {data && data.length > 0 ? (
              data.map(reservation => <ReservationCard key={reservation.id} reservation={reservation} />)
            ) : (
              <div>승인 내역이 없습니다.</div>
            )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="declined">
          {' '}
          <div className={S.CardWrapper}>
            {data && data.length > 0 ? (
              data.map(reservation => <ReservationCard key={reservation.id} reservation={reservation} />)
            ) : (
              <div>거절 내역이 없습니다.</div>
            )}
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
