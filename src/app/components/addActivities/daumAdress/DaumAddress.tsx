'use client';
import { useState } from 'react';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import Input from '../../@shared/input/Input';
import Modal from '../../@shared/modal/Modal';
import S from './DaumAddress.module.scss';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
  UseFormSetValue,
  FieldValues,
  UseFormGetValues,
} from 'react-hook-form';

interface DaumAddressProps {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  message?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
}
const DaumAddress = ({ error, message, register, setValue, getValues }: DaumAddressProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setValue('address', fullAddress);
    setIsVisible(false);
  };

  return (
    <div className={S.daumAddressWrapper}>
      <Modal isOpen={isVisible} onClose={() => setIsVisible(false)}>
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </Modal>
      <Input
        label="주소"
        htmlFor="address"
        placeholder="주소를 검색해주세요"
        onClick={() => setIsVisible(true)}
        error={error}
        register={register}
        message={message}
        value={getValues('adress')}
      />
    </div>
  );
};

export default DaumAddress;
