import React from 'react';

export default class Main extends React.Component {
  render() {
    return <div>
                <h1>Hello world</h1>
                <h2>!</h2>
    			<p>{this.props.prop}</p>
   		   </div>
  }
}