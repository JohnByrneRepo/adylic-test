import React, { useState, useEffect } from 'react';
import { mockFetch } from './back-end/server';
import './App.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [frames, setFrames] = useState([]);
  const [columns, setColumns] = useState([]);
  const [view, setView] = useState('one');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      const variant = await mockFetch('/variant').catch(e => console.log(e));
      const columns = await mockFetch('/columns').catch(e => console.log(e));
      const frameData = variant.body.creativeList[0].workingData.frames;
      const frames = [frameData.first]
        .concat(frameData.middle)
        .concat([frameData.last]);

      setFrames(frames);
      setColumns(columns.body);
    }
    catch (error) {
      setError(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const getHeader = (columns) => {
    return columns.filter(column => !column.isHidden).map(column => {
      return <td>{column.keyName.replace('$', '').replace(/([A-Z])/g, ' $1').trim()}</td>
    });
  };

  const showColumn = (key) => {
    let show = false;
    columns.forEach(element => {
      if (element.keyName === key && !element.isHidden) {
        show = true;
      }
    });
    return show;
  };

  const frame = frames[currentFrame] && frames[currentFrame].content;

  const sanitizeItem = (item) => {
    return !isNaN(item) ? item : item.replaceAll('&lt;br/&gt;', '').replaceAll('&pound;', '£').replaceAll('&amp;', '&');
  };

  const getItem = (key, frame) => {
    return key === '$BackgroundImage' ? <img alt="image" src={frame[key].url} /> : <div>{sanitizeItem(frame[key])}</div>
  };

  const showFrame = (frame) => {
    return Object.keys(frame).map((key, index) => showColumn(key)
      ? <td key={index}>{getItem(key, frame)}</td> : <td></td>
    )
  };

  // if (!frame || !columns) return (<div />);

  const getClass = (index, length) => {
    switch (index) {
      case 0: return 'button button-first'
      case length - 1: return 'button button-last'
      default: return 'button'
    }
  };

  const copyFrames = () => {
    setView('all');
  }

  const setFrame = (index) => {
    setCurrentFrame(index);
    setView('one');
  };

  console.log('error:' + error);


  return (
    <ErrorBoundary>
      <div>
        {error ? <Popup>You are not authorised</Popup> :
        
          <div className="heading">
            <div className="buttons">
              {frames.map((frame, index) =>
                <div key={index} className={getClass(index, frames.length)} onClick={() => setFrame(index)} />
              )}
            </div>
            <div className="copy" onClick={copyFrames}>Copy frames</div>
          </div>}
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr>{getHeader(columns)}</tr>
          </thead>
          <tbody>
            {view === 'one' ? <tr>{showFrame(frame)}</tr>
              : frames.map((frame, index) => <tr key={index}>{showFrame(frame.content)}</tr>)
            }
          </tbody>
        </table>
      </div>
    </ErrorBoundary>
  );
}

export default App;
