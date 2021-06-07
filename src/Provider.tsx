import React from 'react';
import { GlobalStyle } from './globalStyle';

interface IProviderProps {
  children?: React.ReactChild;
}

export const Provider = (props: IProviderProps) => {
  const { children } = props;

  return (
    <>
      <GlobalStyle />
      {children}
    </>
  );
};
