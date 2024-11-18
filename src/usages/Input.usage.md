# Input 컴포넌트:

- 이 컴포넌트는 유효성 검사 기능을 포함한 Input 컴포넌트 입니다.
- label, error message 추가도 프롭스에 따라 가능하도록 제작하였습니다.
- 프로젝트의 피그마 디자인에 맞게 input 컴포넌트 디자인으로 만들어 두었으니 그대로 사용하지면 됩니다.
- 커스텀훅을 사용하므로 클라이언트 컴포넌트('use client'를 선언한 컴포넌트)에서만 사용 가능하니 주의해주십시오.
- react-hook-form을 활용하여 리렌더링 최적화가 이미 되어 있어, 따로 디바운싱 처리가 필요없습니다.
- 비밀번호 확인 등과 같이 특정 필드와 연계하여 사용하고 싶다면 함께 제공되는 커스텀 훅의 인자에 넣을 Config를 작성할 때,<br>
  특정 필드 이름 + Confirmation으로 이름을 작성해주시면 자동으로 두 입력 필드가 연동되도록 해두었습니다.
- 유효성 검사를 통과하지 못하면 form submit 이벤트는 일어나지 않습니다.
- form submit가 trigger 되었을 때, 입력 필드들 중 하나라도 통과하지 못한다면,<br>
  통과하지 못한 입력 필드들 중 가장 상위에 있는 입력 필드로 자동으로 포커싱됩니다.
- 매 입력마다 유효성 검사가 일어나며, 유효성 검사를 통과하지 못하면 빨간색으로 input border가 바뀌며,<br>
  에러 메시지가 입력 필드 아래에 표출됩니다.

## Input 컴포넌트 Props

- label(string)?: 라벨 요소에 표출될 텍스트입니다. 값이 없으면 label은 생성되지 않습니다.
- htmlFor(string)?: 라벨과 연동되기 위한 htmlFor 값입니다. 자동으로 input의 id값에도 같은 값이 부여됩니다.
- error(FieldError | Merge<FieldError, FieldErrorsImpl>)?: register에 있는 입력 필드의 error 객체입니다.
- message(string | FieldError | Merge<FieldError, FieldErrorsImpl>)? register에 있는 입력 필드의 massage 객체입니다.
- register(UseFormRegisterReturn)?: useValidForm 훅에서 반환되는 register 객체입니다.
- className(string)?: input을 감싸고 있는 div에 들어갈 className으로, 커스텀 스타일이 가능합니다.
- ...inputProps: 기본 input 요소에서 제공하는 모든 프로퍼티들도 원하실 경우 추가해서 사용하실 수 있습니다.

# useValidForm Custom Hook

- 공용 Input과 연계하여, 유효성 검사를 가능하게 하는 커스텀 훅입니다.
- 가능한 유효성 검사 옵션은 https://react-hook-form.com/docs/useform/register 에 자세히 나와 있습니다.
- ValidationConfig 타입은 @/hooks/useValidForm에 정의 되어 있으며 꺼내서 사용하시면 됩니다.
- 타입 지정 후 키값은 원하는 대로 지으시면 되고, {}를 사용하시면 내부에 사용할 수 있는 옵션이 자동완성됩니다.
- 특정 필드 이름 + Confirmation으로 이름을 작성해주시면 자동으로 두 입력 필드가 연동됩니다.
- mode는 선택 사항이며, 기본적으로 'onChange'로, 입력마다 유효성 검사가 시행됩니다.
- mode는 'onChange' 외에도 {"onBlur": onBlur 시, "onSubmit": onSubmit 시,<br>
  "onTouched": 첫 Blur 시부터, "all": blur 및 change 이벤트에서 일어남} 이 있습니다.

## useValidForm Params

- ValidationConfig(Record<string, RegisterOptions>): 유효성 검사 규칙을 설정합니다.
- mode(Mode): 유효성 검사 트리거 유형을 설정합니다.

## 사용 예시

```tsx
'use client'; // 훅을 사용하기 때문에 'use client' 선언 필요

import { useValidForm, ValidationConfig } from '@/hooks/useValidForm';
import Input from './components/@shared/input/Input';
import { VALID_OPTIONS } from '@/constants/validOption';
import { FieldValues } from 'react-hook-form';

const config: ValidationConfig = {
  // 키값이 입력 필드의 name이 됩니다.
  validTest: {
    required: '해당 입력란은 비워둘 수 없습니다.', // true, false 또는 massage(위반 시 메시지란에 자동으로 들어가는 문자열)를 입력할 수 있습니다.
    minLength: {
      value: 2, // 최소 길이
      message: '2자 이상으로 작성해주세요.', // 위반 시 표출될 메시지
    },
    maxLength: VALID_OPTIONS.maxLength10, // 자주 쓰는 옵션은 상수 파일에 따로 몇가지 만들어두었습니다. 향후 직접 추가하셔도 됩니다.
  },
  validTestConfirmation: {
    // 동일한 필드 네임 뒤에 Confirmation을 붙이면 두 입력란은 동기화되어 입력 시마다 함께 유효성 검사가 일어납니다.
    required: '해당 입력란은 비워둘 수 없습니다.',
    minLength: {
      value: 2,
      message: '2자 이상으로 작성해주세요.',
    },
    maxLength: VALID_OPTIONS.maxLength10,
    // 동기화 시에 시행할 유효성 검사 내용을 matched 메서드를 활용하여 제작해주면 됩니다.
    validate: {
      matched: (value, formValues) => value === formValues.validTest || 'validTest와 일치하지 않습니다.',
    },
  },
};

export default function Home() {
  // 작성한 config를 useValidForm의 인자로 넣어주면 해당 config가 적용된 메서드들이 반환됩니다.
  // errors: 각 입력 필드에 대한 유효성 검사 위반 유무와 에러 메시지를 담고 있습니다.
  // register: 각 input에 유효성 검사 기능을 부여할 수 있는 객체입니다.
  // handleSubmit: 각 입력 필드들과 연동하여 submit 이벤트를 가능하게 하는 메서드입니다.
  // reset: 개별 또는 입력 필드 전체를 초기화, 또는 특정값으로 변경할 수 있는 메서드입니다.
  // getValues: 전체, 복수, 개별 입력 필드의 값을 가져올 수 있는 메서드입니다.
  // isValid: 현재 입력값들의 유효성 검사 통과 여부를 boolean 값으로 반환합니다.
  const { errors, register, handleSubmit, reset, getValues, isValid } = useValidForm({ validationConfig: config });

  const handleFormSubmit = async (formData: FieldValues) => {
    if (formData.validTest && formData.validTestConfirmation) {
      const { validTest, validTestConfirmation } = formData;
      console.log('validTest:', validTest);
      console.log('validTestConfirmation:', validTestConfirmation);

      reset(); // 모든 입력 필드를 기본값으로 되돌립니다.
      // reset({ validTest: 'reset' }); // 각 입력 필드의 이름과 바꾸고 싶은 값을 줄 수도 있습니다.
    }
  };

  const checkFieldClick = () => {
    const values = getValues(); // 필드 전체 객체 반환
    const singleValue = getValues('validTest'); // 특정 필드의 객체 반환
    const multipleValues = getValues(['validTest', 'validTestConfirmation']); // 복수 필드의 객체 반환

    console.log('values:', values);
    console.log('singleValue:', singleValue);
    console.log('multipleValues:', multipleValues);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '50px' }}
      >
        <Input
          label="유효성 검사 input"
          placeholder="유효성 검사 기능이 있는 input 입니다."
          htmlFor="vTest" // 넣어주면 input name 과 label을 연동시켜 label을 클릭하면 자동으로 해당 입력란에 포커싱됩니다.
          error={errors.validTest} // 각 입력 필드 이름에 맞게 꺼내서 주입하시면 됩니다.
          register={register.validTest}
          message={errors.validTest?.message} // validTest 객체가 없을 수도 있으니, 옵셔널 체이닝 해주시면 됩니다.
        />
        <Input
          label="입력 필드 확인용 Confirmation input"
          placeholder="특정 필드와 연계되어 유효성 검사를 함께 실시하는 input 입니다."
          htmlFor="confirmTest"
          error={errors.validTestConfirmation}
          register={register.validTestConfirmation}
          message={errors.validTestConfirmation?.message}
        />
        <button type="submit">submit</button> {/* 버튼이 하나만 있을 경우에는, 자동으로 type="submit" 입니다.*/}
        {/* 버튼이 여러 개거나, submit 버튼으로 만들고 싶지 않다면 따로 지정해주세요*/}
        <button type="button" onClick={checkFieldClick}>
          check
        </button>
      </form>
    </div>
  );
}
```
