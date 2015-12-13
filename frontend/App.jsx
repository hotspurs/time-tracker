import React from 'react';
import ReactDOM from 'react-dom';
import Main from  'components/Main';

export default class App extends React.Component {
  render() {
    return <Main prop={6} />
  }
}

ReactDOM.render(<App  />, document.getElementById('app'));
