import { ThemeProvider } from 'styled-components';

import { Container } from '@components';
import { GlobalStyle, theme } from '@styles';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container />
    </ThemeProvider>
  );
};

export default App;