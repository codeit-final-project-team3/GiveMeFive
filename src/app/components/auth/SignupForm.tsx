'use client';

import S from './AuthForm.module.scss';
import Input from '../@shared/input/Input';
import Button from '../@shared/button/Button';
import { useValidForm, ValidationConfig } from '@/hooks/useValidForm';
import { VALID_OPTIONS } from '@/constants/validOption';
import { FieldValues } from 'react-hook-form';
import { signup } from '@/fetches/signup';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useToggle } from '@/hooks/useToggle';
import { useState } from 'react';
import ConfirmModal from '../@shared/modal/ConfirmModal';
import { useToastStore } from '@/stores/useToastStore';
import classNames from 'classnames';

const signupConfig: ValidationConfig = {
  email: {
    required: '이메일을 입력해주세요',
    pattern: VALID_OPTIONS.emailPattern,
  },
  nickname: {
    required: '닉네임을 입력해주세요',
    minLength: VALID_OPTIONS.minLength2,
  },
  password: {
    required: '비밀번호를 입력해주세요',
    pattern: VALID_OPTIONS.passwordPattern,
  },
  passwordConfirmation: {
    required: '비밀번호를 한 번 더 입력해주세요',
    pattern: VALID_OPTIONS.passwordPattern,
    validate: {
      matched: (value, formValues) => value === formValues.password || '비밀번호와 일치하지 않습니다.',
    },
  },
};

export default function SignupForm() {
  const router = useRouter();
  const { toggleValue, toggleDispatch } = useToggle();
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, errors, isValid } = useValidForm({ validationConfig: signupConfig });
  const { addToast } = useToastStore(state => state.action);

  const handleSignupFormSubmit = async (formData: FieldValues) => {
    if (formData.email && formData.password && formData.nickname) {
      const { email, password, nickname } = formData;
      try {
        await signup({ email, password, nickname });
        router.replace('/login');
        addToast({ type: 'success', message: '회원가입이 완료되었습니다!' });
      } catch (error) {
        if (error instanceof AxiosError) {
          const message = error.response?.data.message;
          setErrorMessage(message);
          toggleDispatch({ type: 'on' });
        }
      }
    }
  };

  return (
    <form className={S.authForm} onSubmit={handleSubmit(handleSignupFormSubmit)}>
      <Input
        label="이메일"
        placeholder="이메일을 입력해주세요"
        error={errors.email}
        htmlFor="email"
        message={errors.email?.message}
        register={register.email}
      />
      <Input
        label="닉네임"
        placeholder="닉네임을 입력해주세요"
        error={errors.nickname}
        htmlFor="nickname"
        message={errors.nickname?.message}
        register={register.nickname}
      />
      <Input
        label="비밀번호"
        placeholder="8자 이상 입력해 주세요"
        error={errors.password}
        htmlFor="password"
        message={errors.password?.message}
        register={register.password}
        type="password"
      />
      <Input
        label="비밀번호 확인"
        placeholder="비밀번호를 한번 더 입력해주세요"
        error={errors.passwordConfirmation}
        htmlFor="passwordConfirmation"
        message={errors.passwordConfirmation?.message}
        register={register.passwordConfirmation}
        type="password"
      />
      <Button
        buttonColor="gray"
        borderRadius="radius6"
        textSize="md"
        padding="padding8"
        disabled={!isValid}
        className={classNames({ [S.active]: isValid })}
      >
        회원가입 하기
      </Button>
      <ConfirmModal
        isOpen={toggleValue}
        onConfirm={() => toggleDispatch({ type: 'off' })}
        onClose={() => toggleDispatch({ type: 'off' })}
        message={errorMessage}
      />
    </form>
  );
}
