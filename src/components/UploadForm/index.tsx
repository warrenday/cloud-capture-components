import React from 'react';
import styled from 'styled-components';
import { Dropzone } from './Dropzone';
import { ImageUploads } from './ImageUploads';
import { A } from '../Font';
import { fontFamily, rounded, shadow } from '../../styleConfig';
import {
  RequestUpload,
  FinishedUpload,
  useUpload,
} from '../../hooks/useUpload';
import {
  getImagesPreviews,
  IImagePreview,
} from '../../helpers/getImagePreviews';

export interface IUploadProps {
  dropText?: string | React.ReactNode;
  onRequestUpload: RequestUpload;
  onUploadStart: () => void;
  onUploadEnd: (entries: FinishedUpload[]) => void;
}

const StyledContainer = styled.div`
  font-family: ${fontFamily};
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  width: 600px;
  padding: 1.75rem;
  box-sizing: border-box;
  background: #fff;
  box-shadow: ${shadow.lg};
  border-radius: ${rounded['2xl']};
`;

const defaultDropText = (
  <>
    Drop your images here, or <A href="#">browse</A>
  </>
);

export const UploadForm = (props: IUploadProps) => {
  const { dropText, onRequestUpload, onUploadStart, onUploadEnd } = props;

  const [upload, { uploads }] = useUpload<IImagePreview>({
    onRequestUpload,
    onUploadStart,
    onUploadEnd,
  });

  const handleChange = (fileList: FileList) => {
    const previews = getImagesPreviews(fileList);
    upload(previews);
  };

  return (
    <StyledContainer>
      <Dropzone
        dropText={dropText || defaultDropText}
        onChange={handleChange}
      />
      <ImageUploads uploads={uploads} />
    </StyledContainer>
  );
};
