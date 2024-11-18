import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import S from './SubImageInput.module.scss';
import plusIcon from '@/images/plus-icon.svg';
import deleteButton from '@/images/delete-button.svg';
interface SubImage {
  id?: number;
  imageUrl: string;
}

interface BannerImageInputProps {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  message?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  defaultDataSubImages?: SubImage[];
}

interface SubImage {
  id?: number;
  imageUrl: string;
}

export default function SubImageInput({
  error,
  message,
  setValue,
  defaultDataSubImages,
  getValues,
}: BannerImageInputProps) {
  const [imagePreviews, setImagePreviews] = useState<SubImage[]>([]);
  const [imagePreviewFiles, setImagePreviewFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || imagePreviews.length >= 4) return;

    if (defaultDataSubImages) {
      const newPreviews: SubImage[] = files.map(file => ({
        id: undefined,
        imageUrl: URL.createObjectURL(file),
      }));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      const newFiles = files.map(file => file);
      setImagePreviewFiles(prev => [...prev, ...newFiles]);
      const currentImageUrlsToAdd = getValues('subImageUrlsToAdd');
      const newSubImageUrlsToAdd = Array.isArray(currentImageUrlsToAdd) ? currentImageUrlsToAdd : [];
      setValue('subImageUrlsToAdd', [...newSubImageUrlsToAdd, ...newFiles]);
      e.target.value = '';
      return;
    }

    const newPreviews: SubImage[] = files.map(file => ({
      id: undefined,
      imageUrl: URL.createObjectURL(file),
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    const newFiles = files.map(file => file);
    setImagePreviewFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const onRemoveImage = (index: number) => {
    setImagePreviews(prevState => {
      const removedSubImageId = prevState[index]?.id;
      if (defaultDataSubImages) {
        const currentImageUrlIdsToRemove = getValues('subImageIdsToRemove');
        const newSubImageUrlIdsToRemove = Array.isArray(currentImageUrlIdsToRemove) ? currentImageUrlIdsToRemove : [];
        setValue('subImageIdsToRemove', [...newSubImageUrlIdsToRemove, removedSubImageId]);
      }
      const updateState = prevState.filter((_, i) => i !== index);
      return updateState;
    });
    setImagePreviewFiles(prevState => prevState.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (defaultDataSubImages) {
      const previews = defaultDataSubImages.map((image: SubImage) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      }));
      setImagePreviews(previews);
    }
  }, [defaultDataSubImages]);
  useEffect(() => {
    setValue('subImageUrls', imagePreviewFiles);
  }, [imagePreviewFiles]);

  return (
    <div className={S.container}>
      <div className={S.labelName}>소개 이미지</div>
      <div className={S.box}>
        <div className={S.inputBox}>
          <label htmlFor="addSubImage" className={S.labelWrapper}>
            <div className={S.addImageButton}>
              <Image src={plusIcon} alt="이미지 등 록 버튼" width={29.5} height={29.5} />
              <div>이미지 등록</div>
            </div>
          </label>
          <input name="bannerImageUrl" type="file" accept="image/*" id="addSubImage" onChange={handleFileChange} />
        </div>
        {imagePreviews.length > 0 && (
          <div className={S.imagePreviewContainer}>
            {imagePreviews.map((preview, index) => (
              <div key={`${preview}-${index}`} className={S.imagePreviewWrapper}>
                <Image
                  src={preview.imageUrl}
                  alt={`미리보기 이미지 ${index + 1}`}
                  width={180}
                  height={180}
                  className={S.imagePreview}
                />
                <Image
                  src={deleteButton}
                  alt="미리보기 이미지 삭제 버튼"
                  width={24}
                  height={24}
                  className={S.deleteButton}
                  onClick={() => onRemoveImage(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className={S.message}>{message?.toString()}</p>}
      <div className={S.miniText}>*이미지는 최대 4개까지 등록 가능합니다.</div>
    </div>
  );
}
