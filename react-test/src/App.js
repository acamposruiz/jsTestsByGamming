import _ from 'lodash';
import React, {Component} from 'react';
import logo from './logo.svg';
import logoGithub from './github-icon.svg';
import backIcon from './back.svg';
import './App.css';
import {ELEMENTS_INITIAL_STATE, ELEMENTS_OPTIONS, ELEMENTS_COLORS} from "./constants"

const REACT_VERSION = React.version;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mockData: [], // Where the list of elements will be store
      isToggleOn: false, // On/Off state indicator
      step: 0, // Iteration step
      elnumValue: ELEMENTS_INITIAL_STATE,
      elnumOptions: ELEMENTS_OPTIONS,
      secondsCounter: 0,
      timer: undefined
    };
    this.switchState = this.switchState.bind(this);
    this.clear = this.clear.bind(this);
    this.setElnumValue = this.setElnumValue.bind(this);
  }

  /* Here we manage switching from initial state to running state (and the way back) when the application starts to generate data */
  switchState() {
    const newState = {isToggleOn: !this.state.isToggleOn, step: this.state.step};
    /* If the application is already running will gets stopped */
    if (this.state.int) {
      clearInterval(this.state.int);
      newState.int = undefined;
      clearInterval(this.state.timer);
    } else {
      newState.timer = setInterval(() => {
        this.state.secondsCounter += 1;
      }, 1000);
      /* If the application isn't running it starts to generate data */
      newState.int = setInterval(() => {
        /*Checking elements limit*/
        if ((newState.step * 10) >= this.state.elnumValue) {
          this.clear(false);
          return;
        }
        newState.step++;
        this.setState({
          step: newState.step,
          mockData: _.shuffle(_.range(newState.step * 10).map((element, index) => {
            return {style: this.divStyle(), content: index};
          }))
        });
      }, 1);
    }
    this.setState(newState);
  }

  /* Go back to initial state */
  clear(manual) {
    const newState = {};
    if (this.state.int) {
      clearInterval(this.state.int);
    }
    if (manual) {
      clearInterval(this.state.timer);
      newState.secondsCounter = 0;
      newState.mockData = [];
      newState.step = 0;
    }
    this.setState({
      ...newState,
      isToggleOn: false,
      int: undefined
    });
  }

  setElnumValue(elnumValue) {
    return function () {
      this.clear(true);
      this.setState({elnumValue});
    }.bind(this);
  }

  divStyle() {
    function ramdonColor() {
      return _.shuffle(ELEMENTS_COLORS)[0];
    }

    return {color: ramdonColor(), 'background-color': ramdonColor()};
  }

  render() {
    var extradigits = (this.state.step === 0) ? '000' : (this.state.step < 10) ? '00' : (this.state.step < 100) ? '0' : '';
    return (
      <div className="App">
        <div className="App-intro content">
          {this.state.mockData.map(function (data, i) {
            return <div key={i} style={data.style}>{data.content}</div>
          })}
        </div>
        <div className="modal-container">
          <div className="modal-head">
            <div className="controls">
              <button className={this.state.isToggleOn ? 'active' : 'no-active'} onClick={this.switchState}>
                {this.state.isToggleOn ? 'STOP' : 'START'}
              </button>
              <button onClick={this.clear}>
                CLEAR
              </button>
            </div>
            <div className="logo">
              <h5 className="App-title">
                <img src={logo} className="App-logo" alt="logo"/>
                React <small>(v.{REACT_VERSION})</small>
              </h5>
            </div>
          </div>
          <div className="modal-content">
            <div className="content">
              <div className="counter elements">
                <p>{extradigits}{this.state.step * 10}</p>
                <small>elements</small>
              </div>
              <div className="counter time">
                <p> {`${(this.state.secondsCounter < 10) ? "0" : ""}${this.state.secondsCounter}`}</p>
                <small>seconds</small>
              </div>
            </div>
          </div>
          <div className="modal-foot">
            {this.state.elnumOptions.map(function (elnum, i) {
              return <button className={(this.state.elnumValue === elnum) ? 'active' : 'no-active'}
                             onClick={this.setElnumValue(elnum)} key={i}>{elnum}</button>
            }.bind(this))}
          </div>
          <div className="info">
            <a target="_blank" className="social github-icon" href="https://github.com/acamposruiz/js-frameworks-tests/blob/master/react-test/src/App.js">
              <img className="img-social" alt="Github" src={logoGithub}/> <span>View source code</span>
            </a>
          </div>
        </div>
        <div className="back-container">
          <a title="Go back" className="back-link" href="https://acamposruiz.github.io/js-frameworks-tests/builds/home/index.html">
            <img className="img-social" alt="Github" src={backIcon}/>
          </a>
        </div>
      </div>
    );
  }
}

export default App;
