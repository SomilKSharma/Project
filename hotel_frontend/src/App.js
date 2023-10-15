import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import NavBar from './components/navbar/NavBar';
import LeftPart from './components/leftPart/LeftPart';
import RightPart from './components/rightPart/RightPart';
import NewBook from './components/newbook/NewBook';
import ViewBook from './components/viewbook/ViewBook';
import EditBook from './components/editbook/EditBook';

function App() {
  return (
    <Router>
      <div className="App overflow-y-hidden">
        <Header />
        <div className='w-full min-h-[90vh] grid grid-cols-12'>
          <NavBar />

          <div className='grid grid-cols-1 md:grid-cols-5 col-span-10 w-full'>
            <Routes>
              <Route
                path="/"
                element={
                  <React.Fragment>
                    <LeftPart />
                    <RightPart />
                  </React.Fragment>
                }
              />
              <Route
                path="/right"
                element={
                  <React.Fragment>
                    <LeftPart />
                    <RightPart />
                  </React.Fragment>
                }
              />
              <Route
                path="/newBook"
                element={
                  <React.Fragment>
                    <LeftPart />
                    <NewBook />
                  </React.Fragment>
                }
              />
              <Route
                path="/editBook/:bookingId"
                element={
                  <React.Fragment>
                    <LeftPart />
                    <EditBook />
                  </React.Fragment>
                }
              />
              <Route path="/viewBook" element={<ViewBook />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
