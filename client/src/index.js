import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import BoardApp from './js/BoardApp';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <BoardApp />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
