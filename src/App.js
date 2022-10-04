import React from 'react';
import {Router, Route} from 'react-router-dom';
import {history} from './utils/history';
import {MapDemoView} from './components/MapDemoView';
import './App.css';

function App() {

  return (
    <>
        <Router history={history}>
            <div>
                <Route exact path='/' component={MapDemoView} />
            </div>
        </Router>
    </>
  );
}

export default App;
