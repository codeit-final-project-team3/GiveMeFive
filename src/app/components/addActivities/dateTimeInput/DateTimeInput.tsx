import { useEffect, useRef, useState } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import { ActionIcon, rem } from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Image from 'next/image';
import S from './DateTimeInput.module.scss';
import plusIcon from '@/images/add-plus-button.svg';
import minusIcon from '@/images/delete-minus-button.svg';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type DateTimeType = {
  id?: number;
  startTime: string;
  endTime: string;
  date: string;
};

interface DateTimeInputProps {
  setValue: any;
  getValues: any;
  id?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  message?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
  defaultDataSchedules?: DateTimeType[];
}

export default function DateTimeInput({
  setValue,
  getValues,
  id,
  error,
  message,
  defaultDataSchedules,
}: DateTimeInputProps) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dateTime, setDateTime] = useState<DateTimeType>({
    startTime: '',
    endTime: '',
    date: '',
  });

  const [dateTimeBox, setDateTimeBox] = useState<DateTimeType[]>([]);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

  const handlePickerClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.showPicker();
  };

  const pickerControl = (ref: React.RefObject<HTMLInputElement>) => (
    <ActionIcon variant="subtle" color="gray" onClick={() => handlePickerClick(ref)}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const onDateSelectChange = (selectedDate: Date | null) => {
    const formatData = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';
    setDateTime(prevState => ({
      ...prevState,
      date: formatData,
    }));
  };

  const onStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    setDateTime(prevState => ({
      ...prevState,
      startTime: time,
    }));
  };

  const onEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    setDateTime(prevState => ({
      ...prevState,
      endTime: time,
    }));
  };

  const onAddSchedule = () => {
    // 날짜, 시작 시간, 종료시간을 다 입력했는지 검사
    if (!(dateTime.date && dateTime.startTime && dateTime.endTime)) {
      setErrorMessage('날짜, 시작 시간, 종료 시간을 입력해 주세요');
      return;
    }
    const newStart = dayjs(`${dateTime.date} ${dateTime.startTime}`);
    const newEnd = dayjs(`${dateTime.date} ${dateTime.endTime}`);
    // 종료 시간이 시작 시간보다 빠른지 검사
    if (newEnd.isBefore(newStart)) {
      setErrorMessage('종료 시간이 시작 시간보다 빠를 수 없습니다.');
      return;
    }
    const isDuplicate = dateTimeBox.some(item => {
      const existingStart = dayjs(`${item.date} ${item.startTime}`);
      const existingEnd = dayjs(`${item.date} ${item.endTime}`);
      return (
        (newStart.isSameOrAfter(existingStart) && newStart.isBefore(existingEnd)) || // 시작 시간이 기존 범위에 포함될 때
        (newEnd.isAfter(existingStart) && newEnd.isSameOrBefore(existingEnd)) || // 종료 시간이 기존 범위에 포함될 때
        (newStart.isBefore(existingStart) && newEnd.isAfter(existingEnd)) // 기존 시간 범위 전체를 포함할 때
      );
    });
    // 새로 추가할 스케쥴이 기존 스케쥴 시간대와 겹치는지 검사
    if (isDuplicate) {
      setErrorMessage('이미 동일한 시간의 일정이 존재합니다.');
      return;
    }
    if (defaultDataSchedules) {
      const currentScheduleToAdd = getValues('schedulesToAdd');
      const newScheduleToAdd = Array.isArray(currentScheduleToAdd) ? currentScheduleToAdd : [];
      setValue('schedulesToAdd', [...newScheduleToAdd, dateTime]);
      setDateTimeBox(prevState => [...prevState, dateTime]);
      setErrorMessage('');
      return;
    }
    setDateTimeBox(prevState => [...prevState, dateTime]);
    setErrorMessage('');
  };
  const onRemoveSchedule = (index: number) => {
    setDateTimeBox(prevState => {
      const removedScheduleId = prevState[index]?.id;
      if (removedScheduleId) {
        const currentScheduleIdsToRemove = getValues('scheduleIdsToRemove');
        const newScheduleIdsToRemove = Array.isArray(currentScheduleIdsToRemove) ? currentScheduleIdsToRemove : [];
        setValue('scheduleIdsToRemove', [...newScheduleIdsToRemove, removedScheduleId]);
      }
      const updatedState = prevState.filter((_, i) => i !== index);
      return updatedState;
    });
  };
  useEffect(() => {
    if (defaultDataSchedules) {
      setDateTimeBox(defaultDataSchedules);
    }
  }, [defaultDataSchedules]);
  useEffect(() => {
    if (!dateTimeBox) return;
    setValue('schedules', dateTimeBox);
  }, [dateTimeBox]);

  return (
    <div className={S.container}>
      <div className={S.datePickerInputContainer}>
        <div className={S.datePickerWrapper}>
          <DatePickerInput
            id={id}
            label="날짜"
            valueFormat="YY/MM/DD"
            rightSection={icon}
            placeholder="YY/MM/DD"
            rightSectionPointerEvents="none"
            onChange={onDateSelectChange}
            value={dateTime.date ? dayjs(dateTime.date).toDate() : null}
            minDate={new Date()}
            classNames={{
              input: `${S.input} ${error ? S.error : ''}`,
              root: S.root,
              day: S.day,
            }}
          />
        </div>
        <div className={S.timeWrapper}>
          <TimeInput
            label="시작 시간"
            placeholder="0:00"
            ref={startRef}
            rightSection={pickerControl(startRef)}
            value={dateTime.startTime}
            onChange={onStartTimeChange}
            classNames={{
              input: `${S.timeInput} ${error ? S.error : ''}`,
              root: S.root,
            }}
          />
        </div>
        <div className={S.tilde}>~</div>
        <div className={S.timeWrapper}>
          <TimeInput
            label="종료 시간"
            placeholder="0:00"
            ref={endRef}
            rightSection={pickerControl(endRef)}
            value={dateTime.endTime}
            onChange={onEndTimeChange}
            classNames={{
              input: `${S.timeInput} ${error ? S.error : ''}`,
              root: S.root,
            }}
          />
        </div>
        <div className={S.plusButton} onClick={onAddSchedule}>
          <Image className={S.buttonImage} src={plusIcon} alt="일정 등록 버튼" width={56} height={56} />
        </div>
      </div>
      <div className={S.itemDateTimeContainer}>
        {dateTimeBox &&
          dateTimeBox.map((item, index) => (
            <div key={`${item}`} className={S.itemDateTime}>
              <div className={S.itemDate}>{dayjs(item.date).format('YY/MM/DD')}</div>
              <div className={S.itemTime}>{item.startTime}</div>
              <div className={S.itemTilde}>~</div>
              <div className={S.itemTime}>{item.endTime}</div>
              <div className={S.minusButton} onClick={() => onRemoveSchedule(index)}>
                <Image className={S.buttonImage} src={minusIcon} alt="일정 삭제 버튼" width={56} height={56} />
              </div>
            </div>
          ))}
      </div>
      {errorMessage && <p className={S.message}>{errorMessage}</p>}
      {error && <p className={S.message}>{message?.toString()}</p>}
    </div>
  );
}
