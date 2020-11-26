import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: { message: '', stack: '' },
    info: { componentStack: '' }
  };

  static getDerivedStateFromError = error => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };

  closeError = () => {
    this.setState({hasError: false});
  };

  render() {
    const { hasError, error, info } = this.state;
    const { children } = this.props;

    return hasError ? <div className="popup">
      <div className="message">You are not authorised</div>
      <div className="close" onClick={this.closeError}>X</div>
    </div> : children;
  }
}