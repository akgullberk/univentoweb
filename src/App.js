import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import KulupSec from './pages/KulupSec';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProfileInfo from './pages/ProfileInfo';
import MyEvents from './pages/MyEvents';
import CreateEvent from './pages/CreateEvent';
import ParticipationRequests from './pages/ParticipationRequests';
import EventDetail from './pages/EventDetail';
import ClubDetail from './pages/ClubDetail';
import MembershipRequests from './pages/MembershipRequests';
import ClubMembers from './pages/ClubMembers';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kulup-sec" element={<KulupSec />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/info" element={<ProfileInfo />} />
          <Route path="/profile/my-events" element={<MyEvents />} />
          <Route path="/profile/create-event" element={<CreateEvent />} />
          <Route path="/profile/requests" element={<ParticipationRequests />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/club/:clubId" element={<ClubDetail />} />
          <Route path="/profile/membership-requests" element={<MembershipRequests />} />
          <Route path="/profile/club-members" element={<ClubMembers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
