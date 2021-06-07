import React from 'react';
import styled from 'styled-components';
import { rounded } from '../../styleConfig';

export interface IImagePreviewProps {
  type: string;
  src: string;
}

type ImageType = 'PNG' | 'JPG' | 'SVG' | 'TIFF' | 'WEBP';
export interface IImageContainerProps {
  type: ImageType;
}

// const typeColorMap = {
//   PNG: color.yellow[500],
//   JPG: color.red[400],
//   SVG: color.grey[500],
//   TIFF: color.indigo[500],
//   WEBP: color.blue[500],
// };

const getImageTypeFromFileType = (fileType: string): ImageType => {
  const [, imageType = ''] = fileType.split('/');
  const imageTypeUpper = imageType.toUpperCase();

  if (imageTypeUpper === 'SVG+XML') {
    return 'SVG';
  }
  if (imageTypeUpper === 'JPEG') {
    return 'JPG';
  }
  return imageTypeUpper as ImageType;
};

const StyledImageContainer = styled.div<IImageContainerProps>`
  width: 65px;
  height: 45px;
  box-sizing: border-box;
  border-radius: ${rounded.lg};
  position: relative;
  overflow: hidden;
  background: #333;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  object-fit: cover;
`;

export const ImagePreview = (props: IImagePreviewProps) => {
  const { src, type } = props;
  const imageType = getImageTypeFromFileType(type);

  return (
    <StyledImageContainer type={imageType}>
      <StyledImg src={src} />
    </StyledImageContainer>
  );
};
