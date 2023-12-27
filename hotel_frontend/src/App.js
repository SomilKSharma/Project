// Import necessary modules from React and React Router
import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectContext from './context/HotelContext';

// Import components from specific paths
import Header from './components/header/Header';
import NavBar from './components/navbar/NavBar';
import Loading from './components/loading/Loading';
import ApiCalls from './components/apicalls/ApiCalls';

// Use React.lazy to lazily load components
const LeftPart = lazy(() => import('./components/leftPart/LeftPart'));
const RightPart = lazy(() => import('./components/rightPart/RightPart'));
const NewBook = lazy(() => import('./components/newbook/NewBook'));
const ViewBook = lazy(() => import('./components/viewbook/ViewBook'));
const EditBook = lazy(() => import('./components/editbook/EditBook'));
const NotFound = lazy(() => import('./components/notfound/NotFound'));

// Main App component
function App() {
  // states for global usage
  const [allBookings, setAllBookings] = useState([]);
  const [allRoomTypes, setAllRoomTypes] = useState([]);
  const [allRoomNumbers, setAllRoomNumbers] = useState([]);
  const [toggle, setToggle] = useState(true);
  // setAllBookings
  function getAllBookings(array) {
    setAllBookings([...array]);
  }
  function getAllRoomTypes(array) {
    setAllRoomTypes([...array]);
  }
  function getAllRoomNumbers(array) {
    setAllRoomNumbers([...array]);
  }
  function changeToggle() {
    setToggle(toggle => !toggle);
  }
  return (
    <Router>
      <ProjectContext.Provider value={{ allBookings: allBookings, allRoomNumbers: allRoomNumbers, allRoomTypes: allRoomTypes, getAllRoomNumbers: getAllRoomNumbers, getAllRoomTypes: getAllRoomTypes, getAllBookings: getAllBookings, changeToggle: changeToggle, toggle: toggle }}>
        <ApiCalls />
        {/* App container with hidden overflow */}
        <div className="App overflow-y-hidden">
          {/* Header component */}
          <Header />

          {/* Main content grid */}
          <div className='w-full min-h-[90vh] grid grid-cols-12'>
            {/* Navigation bar component */}
            <NavBar />

            {/* Content area with dynamic Routes */}
            <div className='grid grid-cols-1 md:grid-cols-5 col-span-10 w-full'>
              {/* React Router Routes configuration */}
              <Routes>
                {/* Default route rendering LeftPart and RightPart */}
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<Loading />}>
                      <>
                        <LeftPart />
                        <RightPart />
                      </>
                    </Suspense>
                  }
                />

                {/* Route for creating a new book */}
                <Route
                  path="/newBook"
                  element={
                    <Suspense fallback={<Loading />}>
                      {/* Loading LeftPart and NewBook components lazily */}
                      <>
                        <LeftPart />
                        <NewBook />
                      </>
                    </Suspense>
                  }
                />

                {/* Route for editing a book with a dynamic bookingId parameter */}
                <Route
                  path="/editBook/:bookingId"
                  element={
                    <Suspense fallback={<Loading />}>
                      {/* Loading LeftPart and EditBook components lazily */}
                      <>
                        <LeftPart />
                        <EditBook />
                      </>
                    </Suspense>
                  }
                />

                {/* Route for viewing a book */}
                <Route
                  path="/viewBook"
                  element={
                    <Suspense fallback={<Loading />}>
                      {/* Loading ViewBook component lazily */}
                      <ViewBook />
                    </Suspense>
                  }
                />
                {/* Route for NotFound component when no other route matches */}
                <Route path="*" element={
                  <Suspense fallback={<Loading />}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </ProjectContext.Provider>
    </Router >
  );
}

// Export the App component as the default export of this module
export default App;
