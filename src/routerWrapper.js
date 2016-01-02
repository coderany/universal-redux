import React, {Component} from 'react';
import Router from './router'

export default class extends Component{
  render(){
    return <div className="router-wrapper">
      <Router/>
    </div>
  }
}