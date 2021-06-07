import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	animation: cc_spin 1s linear infinite;

  @keyframes cc_spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
