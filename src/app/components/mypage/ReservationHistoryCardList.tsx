import React, { useEffect, useState } from 'react';
import ReservationHistoryCard from './ReservationHistoryCard';
import Dropdown from '../../components/@shared/dropdown/Dropdown';
import AlertModal from '../../components/@shared/modal/AlertModal';
import S from './ReservationHistoryCardList.module.scss';
import { getMyReservations, GetMyReservationsProps, cancelReservation } from '@/fetches/reservationHistory';

interface Reservation {
  id: number;
  activity: {
    id: number;
    title: string;
    bannerImageUrl: string;
  };
  scheduleId: number;
  teamId: string;
  userId: number;
  status: string;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

function ReservationHistoryCardList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const params: GetMyReservationsProps = {
        page: 1,
        size: 10,
        sort: 'latest',
      };

      const data = await getMyReservations(params);
      setReservations(data.reservations);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  }

  function openAlert(reservationId: number) {
    setSelectedReservationId(reservationId);
    setIsAlertOpen(true);
  }

  function handleCloseAlert() {
    setIsAlertOpen(false);
    setSelectedReservationId(null);
  }

  async function handleConfirmDelete() {
    if (selectedReservationId !== null) {
      try {
        await cancelReservation(selectedReservationId);
        setIsAlertOpen(false);
        setSelectedReservationId(null);
        await fetchData();
        console.log('예약이 취소되었습니다.');
      } catch (error) {
        console.error('예약 취소 중 오류가 발생했습니다:', error);
      }
    }
  }

  const statusMapping: { [key: string]: string } = {
    전체: 'all',
    '예약 신청': 'pending',
    '예약 승인': 'confirmed',
    '체험 완료': 'completed',
    '예약 거절': 'declined',
    '예약 취소': 'canceled',
  };

  function toggleDropdown() {
    setIsDropdownOpen(prevState => !prevState);
  }

  const filteredReservations =
    selectedStatus === '전체'
      ? reservations
      : reservations.filter(reservation => reservation.status === statusMapping[selectedStatus]);

  return (
    <div className={S.container}>
      <div className={S.header}>
        <div className={S.title}>예약 내역</div>
        <Dropdown
          data={Object.keys(statusMapping)}
          onChange={value => setSelectedStatus(value)}
          toggleDropdown={toggleDropdown}
          isDropdownToggle={isDropdownOpen}
          type="category"
          selectedValue={selectedStatus}
        />
      </div>
      <div className={S.list}>
        {filteredReservations.map(reservation => (
          <ReservationHistoryCard
            key={reservation.id}
            reservation={reservation}
            onCancelSuccess={() => openAlert(reservation.id)}
          />
        ))}
      </div>
      {isAlertOpen && (
        <AlertModal
          isOpen={isAlertOpen}
          onClose={handleCloseAlert}
          onAlert={handleConfirmDelete}
          message="정말로 예약을 취소하시겠습니까?"
          alertButtonText="취소"
        />
      )}
    </div>
  );
}

export default ReservationHistoryCardList;
