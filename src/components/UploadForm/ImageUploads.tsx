import React from 'react';
import styled from 'styled-components';
import { IImagePreview } from '../../helpers/getImagePreviews';
import { Upload } from '../../hooks/useUpload';
import { ImageUploadRow } from './ImageUploadRow';

interface IImageUploadsProps {
  uploads: Upload<IImagePreview>[];
}

const StyledContainer = styled.ul<{ hasContent: boolean }>`
  display: grid;
  grid-gap: 1rem 0;
  padding: 1rem 0 0 0;
  margin: 0;
`;

export const ImageUploads = (props: IImageUploadsProps) => {
  const { uploads } = props;

  if (!uploads.length) {
    return null;
  }

  return (
    <StyledContainer hasContent={Boolean(uploads.length)}>
      {uploads.map(upload => (
        <ImageUploadRow key={upload.id} upload={upload} />
      ))}
    </StyledContainer>
  );
};
