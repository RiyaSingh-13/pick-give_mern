import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { LandingPage } from './pages/LandingPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  // Extract all states & handlers from the custom orchestrator hook
  const state = useAppLogic();

  // Simple Path Router: Destructure and pass all states via the spread operator {...state}
  if (state.currentPath === '/admin') {
    return <AdminDashboard {...state} />;
  }

  if (state.currentPath === '/ngo') {
    if (!state.currentNgo) {
      state.navigateTo('/');
      return null;
    }
    return <NgoDashboard {...state} />;
  }

  if (state.currentPath === '/member') {
    if (!state.currentMember) {
      state.navigateTo('/');
      return null;
    }
    return <MemberDashboard {...state} />;
  }

  // Render main landing page by default
  return <LandingPage {...state} />;
}

export default App;
