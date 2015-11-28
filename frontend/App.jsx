import React from 'react';

import Main from  'components/Main';

export default class App extends React.Component {
  render() {
    return <Main prop={20000} />
  }
}

React.render(<App  />, document.getElementById('app'));