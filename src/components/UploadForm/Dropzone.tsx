import React from 'react';
import { P } from '../Font';
import { fontSize, color, rounded, transition } from '../../styleConfig';
import styled from 'styled-components';
import { UploadIcon } from '../../icons/UploadIcon';

export interface IDropzoneProps {
  dropText: string | React.ReactNode;
  onChange: (fileList: FileList) => void;
}

const StyledLabel = styled.label`
  display: none;
`;

const StyledDropzoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 2px dashed ${color.grey[200]};
  border-radius: ${rounded.lg};
  width: 100%;
  padding: 2rem 0;
  position: relative;
  transition: ${transition};

  &:hover {
    border-color: ${color.blue[500]};
    background: #e6f1ff;
  }
`;

const StyledUploadIcon = styled(UploadIcon)`
  margin-bottom: 1rem;
`;

const StyledFileInput = styled.input`
  position: absolute;
  cursor: pointer;
  opacity: 0;
  width: 100%;
  height: 100%;
`;

export const Dropzone = (props: IDropzoneProps) => {
  const { dropText, onChange } = props;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    onChange(event.target.files);
  };

  return (
    <StyledDropzoneContainer>
      <StyledLabel htmlFor="cc-dropzone">{dropText}</StyledLabel>
      <StyledFileInput
        id="cc-dropzone"
        type="file"
        onChange={handleChange}
        multiple
      />
      <StyledUploadIcon width={30} fill={color.grey[400]} />
      <P bold>{dropText}</P>
      <P fontSize={fontSize.xs} color={color.grey[400]} bold>
        JPG, PNG, WEBP, TIFF, SVG up to 10MB
      </P>
    </StyledDropzoneContainer>
  );
};
