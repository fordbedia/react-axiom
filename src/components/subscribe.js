import React                from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';


const PUBLISHABLE_FUNCTION_NAMES = [
  'subscribe',
  'unsubscribe',
  'publish'
];


export default function subscribe(Component) {

  //===================
  // WRAPPER COMPONENT
  //===================

  class Subscriber extends React.Component {

    //=============
    // CONSTRUCTOR
    //=============

    constructor(props) {
      super(props);
      this.forceUpdate = this.forceUpdate.bind(this);
      this._subscribe = this._subscribe.bind(this);
      this._unsubscribe = this._unsubscribe.bind(this);
    }


    //===============
    // REACT METHODS
    //===============

    componentDidMount() {
      this._getPublishables().forEach(this._subscribe);
    }

    componentDidUpdate(prevProps) {
      Object.keys(this.props).forEach(key => {
        if (this.props[key] === prevProps[key]) return;

        if (this._isPublishable(this.props[key])) {
          this._subscribe(this.props[key]);
        }

        if (this._isPublishable(prevProps[key])) {
          this._unsubscribe(prevProps[key]);
        }
      });
    }

    componentWillUnmount() {
      this._getPublishables().forEach(this._unsubscribe);
    }

    render() {
      return React.createElement(Component, this.props);
    }


    //==================
    // INTERNAL METHODS
    //==================

    _getPublishables() {
      return Object.keys(this.props).reduce((publishables, key) => {
        if (this._isPublishable(this.props[key])) {
          publishables.push(this.props[key]);
        }
        return publishables;
      }, []);
    }

    _isPublishable(prop) {
      return PUBLISHABLE_FUNCTION_NAMES.every(name => {
        return prop && prop[name] && prop[name] instanceof Function;
      });
    }

    _subscribe(publishable) {
      publishable.subscribe(this.forceUpdate);
    }

    _unsubscribe(publishable) {
      publishable.unsubscribe(this.forceUpdate);
    }

  }


  //==================
  // CLASS PROPERTIES
  //==================

  Subscriber.WrappedComponent = Component;
  Subscriber.displayName = `Subscriber(${Component.displayName || Component.name || 'Component'})`;


  //=====================
  // PASS STATIC METHODS
  //=====================

  return hoistNonReactStatics(Subscriber, Component);

};
