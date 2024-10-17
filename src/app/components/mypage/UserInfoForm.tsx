import React from 'react';
import { Title } from '@mantine/core';
import Input from '../@shared/input/Input';
import Button from '../@shared/button/Button';
import S from './UserInfoForm.module.scss';
import { useValidForm } from '@/hooks/useValidForm';
import { VALID_OPTIONS } from '@/constants/validOption';

const config = {
  nickname: {
    required: '닉네임을 입력해주세요.',
    minLength: VALID_OPTIONS.minLength2,
    maxLength: VALID_OPTIONS.maxLength10,
  },
  email: {
    required: '이메일을 입력해주세요.',
    pattern: VALID_OPTIONS.emailPattern,
  },
  password: {
    required: '비밀번호를 입력해주세요.',
    pattern: VALID_OPTIONS.passwordPattern,
  },
  passwordConfirmation: {
    required: '비밀번호를 재입력해주세요.',
    validate: {
      matched: (value: string, formValues: Record<string, any>) =>
        value === formValues.password || '비밀번호가 일치하지 않습니다.',
    },
  },
};

const UserInfoForm: React.FC = () => {
  const { errors, register, handleSubmit } = useValidForm({ validationConfig: config });

  const handleFormSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <div className={S.userInfoForm}>
      <Title order={2} className={S.title}>
        내 정보
      </Title>

      <form onSubmit={handleSubmit(handleFormSubmit)} className={S.form}>
        <div className={S.buttonWrapper}>
          <Button
            buttonColor="nomadBlack"
            textSize="lg"
            borderRadius="radius6"
            padding="padding14"
            className={S.submitButton}
            type="submit"
          >
            저장하기
          </Button>
        </div>

        <Input
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          htmlFor="nickname"
          error={errors.nickname}
          register={register.nickname}
          message={errors.nickname?.message}
          className={S.input}
        />

        <Input
          label="이메일"
          placeholder="이메일을 입력하세요"
          htmlFor="email"
          error={errors.email}
          register={register.email}
          message={errors.email?.message}
          type="email"
          className={S.input}
        />

        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          htmlFor="password"
          error={errors.password}
          register={register.password}
          message={errors.password?.message}
          type="password"
          className={S.input}
        />

        <Input
          label="비밀번호 재입력"
          placeholder="비밀번호를 재입력하세요"
          htmlFor="passwordConfirmation"
          error={errors.passwordConfirmation}
          register={register.passwordConfirmation}
          message={errors.passwordConfirmation?.message}
          type="password"
          className={S.input}
        />
      </form>
    </div>
  );
};

export default UserInfoForm;
