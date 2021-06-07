import React from 'react';
import styled from 'styled-components';
import byteSize from 'byte-size';
import { color, fontSize, rounded, shadow } from '../../styleConfig';
import { CheckCircle } from '../../icons/CheckCircle';
import { ErrorCircle } from '../../icons/ErrorCircle';
import { Spinner } from '../Spinner';
import { ImagePreview } from './ImagePreview';
import { Upload } from '../../hooks/useUpload';
import { IImagePreview } from '../../helpers/getImagePreviews';

interface IImageUploadRowProps {
  upload: Upload<IImagePreview>;
}

const StyledRowContainer = styled.li`
  border-radius: ${rounded.lg};
  border: 1px solid ${color.grey[200]};
  box-shadow: ${shadow.sm};
  list-style: none;
  position: relative;
  overflow: hidden;
`;

const StyledRowContent = styled.div`
  display: flex;
  padding: 1rem 1.25rem;
  position: relative;
  z-index: 1;
`;

const StyledRowMeta = styled.div`
  margin-left: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledRowTitle = styled.p`
  margin: 0;
  font-size: ${fontSize.sm};
  font-weight: 500;
  color: ${color.coolGrey[900]};
`;

const StyledRowSize = styled.p`
  margin: 0;
  font-size: ${fontSize.sm};
  font-weight: 500;
  color: ${color.coolGrey[500]};
  padding-top: 2px;
`;

const StyledProgress = styled.div<{ progress: number }>`
  bottom: 0;
  left: 0;
  position: absolute;
  width: ${props => props.progress}%;
  height: 100%;
  background: ${color.blue[50]};
  z-index: 0;
  transition: 0.2s;
`;

const StyledRowStatus = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const StyledRowStatusText = styled.div<{ color?: string }>`
  margin-right: 0.75rem;
  font-size: ${fontSize.sm};
  color: ${props => props.color || color.coolGrey['900']};
`;

export const ImageUploadRow = (props: IImageUploadRowProps) => {
  const { upload } = props;
  const { progress, status } = upload;
  const { name, src, type, size } = upload.entry;

  return (
    <StyledRowContainer>
      <StyledProgress progress={progress} />
      <StyledRowContent>
        <ImagePreview src={src} type={type} />
        <StyledRowMeta>
          <StyledRowTitle>{name}</StyledRowTitle>
          <StyledRowSize>{byteSize(size).toString()}</StyledRowSize>
        </StyledRowMeta>
        <StyledRowStatus>
          {status === 'in_progress' && (
            <>
              <StyledRowStatusText>{progress}%</StyledRowStatusText>
              <Spinner />
            </>
          )}
          {status === 'success' && (
            <>
              <StyledRowStatusText color={color.green['500']}>
                Complete
              </StyledRowStatusText>
              <CheckCircle width={24} height={24} fill={color.green[500]} />
            </>
          )}
          {status === 'error' && (
            <>
              <StyledRowStatusText color={color.red['500']}>
                Failed
              </StyledRowStatusText>
              <ErrorCircle width={24} height={24} fill={color.red[500]} />
            </>
          )}
        </StyledRowStatus>
      </StyledRowContent>
    </StyledRowContainer>
  );
};
