import styled from 'styled-components';
import { fontFamily, fontSize } from '../styleConfig';

export interface PProps {
  fontSize?: string;
  bold?: boolean;
  color?: string;
  margin?: string | number;
}

export interface AProps {
  fontSize?: string;
  bold?: boolean;
  color?: string;
}

export const P = styled.p<PProps>`
  font-family: ${fontFamily};
  font-size: ${props => props.fontSize || fontSize.md};
  font-weight: ${props => (props.bold ? '600' : '400')};
  color: ${props => props.color};
  margin: ${props => props.margin || '0 0 0.5rem 0'};
`;

export const A = styled.a<AProps>`
  margin: 0;
  text-decoration: none;
  color: ${props => props.color || '#3b82f6'};
  &:hover {
    text-decoration: underline;
  }
`;
