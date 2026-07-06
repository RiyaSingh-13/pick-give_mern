import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { NgoDashboard } from './pages/NgoDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { api } from './services/api';

function App() {
  // Simple Path Router
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Unified dynamic session states (connected mock DB)
  const [currentMember, setCurrentMember] = useState(() => {
    const saved = localStorage.getItem('currentMember');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentNgo, setCurrentNgo] = useState(() => {
    const saved = localStorage.getItem('currentNgo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('currentMember', JSON.stringify(currentMember));
  }, [currentMember]);

  useEffect(() => {
    localStorage.setItem('currentNgo', JSON.stringify(currentNgo));
  }, [currentNgo]);

  const [donations, setDonations] = useState([]);
  const [adminTab, setAdminTab] = useState('overview'); // 'overview', 'ngos', 'users', 'logs'
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminNgos, setAdminNgos] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [requestForm, setRequestForm] = useState({ category: '', title: '', quantity: '', urgency: 'Low', description: '' });
  const [requestPostedSuccess, setRequestPostedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('isAdminLoggedIn') === 'true');

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const activeNgoRecord = currentNgo ? adminNgos.find(n => n.ngoName === currentNgo.ngoName) : null;
  const ngoStatus = activeNgoRecord ? activeNgoRecord.status : (currentNgo?.status || 'Pending');
  const isApproved = ngoStatus === 'Approved';

  // Load data from live Express backend APIs
  const fetchAllData = async () => {
    try {
      // 1. Fetch Donations
      const resDonations = await api.getDonations();
      if (resDonations.ok) {
        const data = await resDonations.json();
        setDonations(data);
      }

      // 2. Fetch NGOs
      const resNgos = await api.getNgos();
      if (resNgos.ok) {
        const data = await resNgos.json();
        setAdminNgos(data);
        if (data.length > 0) {
          const found = data.find(n => n.ngoName === currentNgo?.ngoName);
          if (!found) {
            const hope = data.find(n => n.ngoName === 'Hope Foundation');
            if (hope) {
              setCurrentNgo(hope);
            } else {
              setCurrentNgo(data[0]);
            }
          } else {
            // Keep the active session up-to-date with status changes from admin actions
            setCurrentNgo(found);
          }
        }
      }

      // 3. Fetch Members
      const resMembers = await api.getMembers();
      if (resMembers.ok) {
        const data = await resMembers.json();
        setAdminUsers(data);
      }

      // 4. Fetch Logs
      const resLogs = await api.getAudits();
      if (resLogs.ok) {
        const data = await resLogs.json();
        setAdminLogs(data);
      }

      // 5. Fetch NGO Requests
      const resRequests = await api.getRequests();
      if (resRequests.ok) {
        const data = await resRequests.json();
        setNgoRequests(data);
      }
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Poll backend every 5 seconds for real-time coordination
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Listen to popstate changes (back/forward browser buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Custom Navigation function
  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [activeCategory, setActiveCategory] = useState(null);
  
  // Modal states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showNgoModal, setShowNgoModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInSuccess, setSignInSuccess] = useState(false);
  
  // Form submission success states
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [ngoSuccess, setNgoSuccess] = useState(false);

  // Form states
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const [ngoForm, setNgoForm] = useState({
    ngoName: '',
    officialEmail: '',
    phone: '',
    address: '',
    description: '',
    registrationNumber: '',
    certificate: null,
    password: ''
  });

  const [uploadedFileName, setUploadedFileName] = useState('');

  // Handlers
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.password) {
      alert('Password is required.');
      return;
    }
    setMemberSuccess(true);
    try {
      const res = await api.registerUser({
        role: 'Member',
        fullName: memberForm.fullName,
        email: memberForm.email,
        phone: memberForm.phone,
        location: memberForm.location,
        password: memberForm.password
      });

      if (res.ok) {
        const user = await res.json();
        const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'RS';
        setCurrentMember({
          fullName: user.fullName,
          initials: initials,
          email: user.email,
          location: user.location,
          phone: user.phone
        });

        setTimeout(() => {
          setMemberSuccess(false);
          setShowMemberModal(false);
          fetchAllData();
          navigateTo('/member');
          setMemberForm({ fullName: '', email: '', phone: '', location: '', password: '' });
        }, 1200);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to register.');
        setMemberSuccess(false);
      }
    } catch (err) {
      console.error('Member submit error:', err);
      setMemberSuccess(false);
    }
  };

  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    if (!ngoForm.password) {
      alert('Password is required.');
      return;
    }
    setNgoSuccess(true);
    try {
      const res = await api.registerUser({
        role: 'NGO',
        ngoName: ngoForm.ngoName,
        officialEmail: ngoForm.officialEmail,
        phone: ngoForm.phone,
        address: ngoForm.address,
        description: ngoForm.description,
        registrationNumber: ngoForm.registrationNumber,
        password: ngoForm.password
      });

      if (res.ok) {
        const ngo = await res.json();
        setCurrentNgo(ngo);

        setTimeout(() => {
          setNgoSuccess(false);
          setShowNgoModal(false);
          fetchAllData();
          navigateTo('/ngo');
          setNgoForm({ ngoName: '', officialEmail: '', phone: '', address: '', description: '', registrationNumber: '', certificate: null, password: '' });
          setUploadedFileName('');
        }, 1200);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to register NGO.');
        setNgoSuccess(false);
      }
    } catch (err) {
      console.error('NGO submit error:', err);
      setNgoSuccess(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInSuccess(false);

    try {
      const res = await api.login(signInEmail, signInPassword);

      if (res.ok) {
        const user = await res.json();
        setSignInSuccess(true);
        setTimeout(() => {
          setShowSignInModal(false);
          setSignInSuccess(false);
          setSignInEmail('');
          setSignInPassword('');
          
          if (user.role === 'Member') {
            const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'M';
            setCurrentMember({
              fullName: user.fullName,
              initials: initials,
              email: user.email,
              location: user.location,
              phone: user.phone
            });
            navigateTo('/member');
          } else if (user.role === 'NGO') {
            setCurrentNgo(user);
            navigateTo('/ngo');
          } else if (user.role === 'Admin') {
            setIsAdminLoggedIn(true);
            navigateTo('/admin');
          }
        }, 1200);
      } else {
        const data = await res.json();
        setSignInError(data.error || 'Failed to sign in. Please verify your email.');
      }
    } catch (err) {
      console.error('Sign In Error:', err);
      setSignInError('Server connection error. Please try again later.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNgoForm({ ...ngoForm, certificate: file });
      setUploadedFileName(file.name);
    }
  };

  // ==========================================
  // NGO DASHBOARD COMPONENT STATES & DATA
  // ==========================================
  const [ngoTab, setNgoTab] = useState('dashboard');
  
  // Derived NGO lists directly connected to globalDonations!
  const ngoDonations = donations.filter(d => 
    (d.ngo === 'Common Pool' || (currentNgo && d.ngo === currentNgo.ngoName)) && 
    d.status === 'Offer Posted'
  );
  const ngoReceived = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status !== 'Offer Posted');
  const ngoDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && (d.status === 'In Transit' || d.status === 'Delivered')).map(d => ({
    id: d._id || d.id,
    courier: d.courier || 'None (Awaiting Courier)',
    route: `${d.donor} ➔ ${d.ngo} Shelter`,
    item: d.title,
    status: d.status === 'In Transit' ? 'On the way' : 'Successfully delivered'
  }));

  const ngoInDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status === 'In Transit').length;
  const ngoCompletedDeliveries = donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.status === 'Delivered').length;
  const ngoActiveVolunteers = [...new Set(donations.filter(d => currentNgo && d.ngo === currentNgo.ngoName && d.courier && d.courier !== 'None (Awaiting Courier)').map(d => d.courier.replace(' (Active)', '').replace(' (Completed)', '')))].length;
  const myRequests = ngoRequests.filter(r => currentNgo && r.ngo === currentNgo.ngoName);

  const handleAcceptDonation = async (id) => {
    try {
      const res = await api.acceptDonation(id, currentNgo.ngoName);
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error accepting donation:', err);
    }
  };

  const handlePostRequest = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!requestForm.category) {
      setValidationError('Please select an item category.');
      return;
    }
    if (!requestForm.title || !requestForm.title.trim()) {
      setValidationError('Please enter an item name / title.');
      return;
    }
    if (!requestForm.quantity || isNaN(Number(requestForm.quantity)) || Number(requestForm.quantity) <= 0) {
      setValidationError('Please enter a valid quantity needed (positive number).');
      return;
    }

    try {
      const res = await api.createRequest({
        title: requestForm.title,
        category: requestForm.category,
        urgency: requestForm.urgency,
        quantity: Number(requestForm.quantity),
        description: requestForm.description,
        ngo: currentNgo.ngoName
      });
      if (res.ok) {
        setRequestPostedSuccess(true);
        setRequestForm({ category: '', title: '', quantity: '', urgency: 'Low', description: '' });
        setValidationError('');
        fetchAllData();
        setTimeout(() => setRequestPostedSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setValidationError(errData.error || 'Server rejected request. Please check input values.');
      }
    } catch (err) {
      console.error('Error posting request:', err);
      setValidationError('Failed to post request. Please check your backend connection.');
    }
  };

  const handleStopRequest = async (id) => {
    if (!window.confirm("Are you sure you want to stop/close this requirement request? Members will no longer see it on the community feed.")) {
      return;
    }
    try {
      const res = await api.stopRequest(id);
      if (res.ok) {
        fetchAllData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to stop the request.');
      }
    } catch (err) {
      console.error('handleStopRequest Error:', err);
      alert('Connection error. Please check your backend server is running.');
    }
  };

  const handleApproveNgo = async (id) => {
    try {
      const res = await api.verifyNgo(id, 'Approved');
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error approving NGO:', err);
    }
  };

  const handleRejectNgo = async (id) => {
    try {
      const res = await api.verifyNgo(id, 'Rejected');
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error rejecting NGO:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await api.deleteUser(id);
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // ==========================================
  // MEMBER DASHBOARD COMPONENT STATES & DATA
  // ==========================================
  const [dashboardTab, setDashboardTab] = useState('dashboard');
  const [radiusFilter, setRadiusFilter] = useState('5');
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [otpInputValues, setOtpInputValues] = useState({}); // { [donationId]: string }
  const [otpErrors, setOtpErrors] = useState({}); // { [donationId]: string }

  // Derived Member list directly connected to globalDonations!
  const activeDonations = donations.filter(d => currentMember && d.donorEmail === currentMember.email);

  // Form states for new booking (with Recipient NGO bound)
  const [newBooking, setNewBooking] = useState({
    step: 1,
    category: null,
    title: '',
    description: '',
    photo: null,
    photoName: '',
    address: '',
    instructions: '',
    ngoName: 'Common Pool', // default Recipient is the common pool
    deliveryMode: 'Volunteer'
  });

  useEffect(() => {
    if (currentMember && !newBooking.address) {
      setNewBooking(prev => ({ ...prev, address: currentMember.location }));
    }
  }, [currentMember]);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Derived claimed delivery routes
  const memberDeliveries = [
    ...(claimedTasks.includes('1105') ? [{ id: '1105', title: 'Warm Clothes & Blankets', location: '14 Baker Street (Your coordinates)', ngo: 'Hope Shelter', status: 'In Transit' }] : []),
    ...donations.filter(d => d.courier && currentMember && d.courier.startsWith(currentMember.fullName)).map(d => ({
      id: (d._id || d.id || '').toString(),
      title: d.title,
      location: d.location,
      ngo: d.ngo,
      status: d.status
    }))
  ];

  // Available volunteer tasks derived from dynamic accepted donations + static preset
  const volunteerTasks = [
    {
      id: '1105',
      title: 'Warm Clothes & Blankets',
      ngo: 'Hope Shelter',
      pickup: '14 Baker Street (Your coordinates)',
      dropoff: '22 Compassion Ave (2.1 km total)',
      weight: 'Light (1 box, clothes)',
      distance: 0.1
    },
    ...donations.filter(d => d.status === 'Accepted' && (!d.courier || d.courier === 'None (Awaiting Courier)')).map(d => ({
      id: (d._id || d.id || '').toString(),
      title: d.title,
      ngo: d.ngo,
      pickup: d.location,
      dropoff: 'Hope Center Shelter (2.5 km total)',
      weight: 'Medium (1 Package)',
      distance: 1.2
    }))
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    try {
      const res = await api.createDonation({
        title: newBooking.title || 'Other Donation',
        category: newBooking.category || 'Clothes',
        donor: currentMember.fullName,
        donorEmail: currentMember.email,
        ngo: newBooking.ngoName || 'Common Pool',
        location: newBooking.address || currentMember.location,
        description: newBooking.description,
        instructions: newBooking.instructions,
        photo: newBooking.photoName,
        deliveryMode: newBooking.deliveryMode || 'Volunteer'
      });
      if (res.ok) {
        setTimeout(() => {
          setBookingSuccess(false);
          setNewBooking({
            step: 1,
            category: null,
            title: '',
            description: '',
            photo: null,
            photoName: '',
            address: currentMember?.location || '',
            instructions: '',
            ngoName: 'Common Pool',
            deliveryMode: 'Volunteer'
          });
          fetchAllData();
          setDashboardTab('donations');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to book donation. Please verify your fields.');
        setBookingSuccess(false);
      }
    } catch (err) {
      console.error('Error booking donation:', err);
      alert('Connection error: could not connect to server. Please try again.');
      setBookingSuccess(false);
    }
  };

  const handleClaimTask = async (taskId) => {
    try {
      const res = await api.claimDonation(taskId, currentMember.fullName);
      if (res.ok) {
        fetchAllData();
        // Toggle in claimedTasks local state for instant local styling coordination
        if (claimedTasks.includes(taskId)) {
          setClaimedTasks(claimedTasks.filter(id => id !== taskId));
        } else {
          setClaimedTasks([...claimedTasks, taskId]);
        }
      }
    } catch (err) {
      console.error('Error claiming task:', err);
    }
  };

  const handleCompleteDelivery = async (id) => {
    try {
      const res = await api.completeDelivery(id, currentMember.fullName);
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error completing delivery:', err);
    }
  };

  const handleStartSelfTransit = async (id) => {
    try {
      const res = await api.startSelfTransit(id);
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error starting self transit:', err);
    }
  };

  const handleCompleteSelfDelivery = async (id) => {
    try {
      const res = await api.completeSelfDelivery(id);
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Error completing self delivery:', err);
    }
  };

  // ==========================================
  // SIMPLE PATH ROUTER
  // ==========================================
  if (currentPath === '/admin') {
    return (
      <AdminDashboard 
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        adminSearchQuery={adminSearchQuery}
        setAdminSearchQuery={setAdminSearchQuery}
        adminNgos={adminNgos}
        adminUsers={adminUsers}
        adminLogs={adminLogs}
        setAdminLogs={setAdminLogs}
        selectedDossier={selectedDossier}
        setSelectedDossier={setSelectedDossier}
        donations={donations}
        ngoRequests={ngoRequests}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        navigateTo={navigateTo}
        handleApproveNgo={handleApproveNgo}
        handleRejectNgo={handleRejectNgo}
        handleDeleteUser={handleDeleteUser}
      />
    );
  }

  if (currentPath === '/ngo') {
    if (!currentNgo) {
      navigateTo('/');
      return null;
    }
    return (
      <NgoDashboard 
        ngoTab={ngoTab}
        setNgoTab={setNgoTab}
        currentNgo={currentNgo}
        setCurrentNgo={setCurrentNgo}
        ngoDonations={ngoDonations}
        ngoReceived={ngoReceived}
        ngoInDeliveries={ngoInDeliveries}
        ngoCompletedDeliveries={ngoCompletedDeliveries}
        ngoActiveVolunteers={ngoActiveVolunteers}
        myRequests={myRequests}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        requestPostedSuccess={requestPostedSuccess}
        validationError={validationError}
        ngoDeliveries={ngoDeliveries}
        adminNgos={adminNgos}
        setAdminNgos={setAdminNgos}
        activeNgoRecord={activeNgoRecord}
        ngoStatus={ngoStatus}
        isApproved={isApproved}
        handleAcceptDonation={handleAcceptDonation}
        handlePostRequest={handlePostRequest}
        handleStopRequest={handleStopRequest}
        fetchAllData={fetchAllData}
        navigateTo={navigateTo}
      />
    );
  }

  if (currentPath === '/member') {
    if (!currentMember) {
      navigateTo('/');
      return null;
    }
    return (
      <MemberDashboard 
        dashboardTab={dashboardTab}
        setDashboardTab={setDashboardTab}
        currentMember={currentMember}
        setCurrentMember={setCurrentMember}
        activeDonations={activeDonations}
        newBooking={newBooking}
        setNewBooking={setNewBooking}
        bookingSuccess={bookingSuccess}
        setBookingSuccess={setBookingSuccess}
        memberDeliveries={memberDeliveries}
        volunteerTasks={volunteerTasks}
        claimedTasks={claimedTasks}
        setClaimedTasks={setClaimedTasks}
        selectedDonationId={selectedDonationId}
        setSelectedDonationId={setSelectedDonationId}
        otpInputValues={otpInputValues}
        setOtpInputValues={setOtpInputValues}
        otpErrors={otpErrors}
        setOtpErrors={setOtpErrors}
        radiusFilter={radiusFilter}
        setRadiusFilter={setRadiusFilter}
        adminNgos={adminNgos}
        ngoRequests={ngoRequests}
        handleBookingSubmit={handleBookingSubmit}
        handleClaimTask={handleClaimTask}
        handleCompleteDelivery={handleCompleteDelivery}
        handleStartSelfTransit={handleStartSelfTransit}
        handleCompleteSelfDelivery={handleCompleteSelfDelivery}
        fetchAllData={fetchAllData}
        navigateTo={navigateTo}
      />
    );
  }

  // Default is landing page
  return (
    <LandingPage 
      currentMember={currentMember}
      setCurrentMember={setCurrentMember}
      currentNgo={currentNgo}
      setCurrentNgo={setCurrentNgo}
      isAdminLoggedIn={isAdminLoggedIn}
      setIsAdminLoggedIn={setIsAdminLoggedIn}
      showSignInModal={showSignInModal}
      setShowSignInModal={setShowSignInModal}
      showMemberModal={showMemberModal}
      setShowMemberModal={setShowMemberModal}
      showNgoModal={showNgoModal}
      setShowNgoModal={setShowNgoModal}
      memberSuccess={memberSuccess}
      memberForm={memberForm}
      setMemberForm={setMemberForm}
      ngoSuccess={ngoSuccess}
      ngoForm={ngoForm}
      setNgoForm={setNgoForm}
      uploadedFileName={uploadedFileName}
      signInSuccess={signInSuccess}
      signInEmail={signInEmail}
      setSignInEmail={setSignInEmail}
      signInPassword={signInPassword}
      setSignInPassword={setSignInPassword}
      signInError={signInError}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      handleMemberSubmit={handleMemberSubmit}
      handleNgoSubmit={handleNgoSubmit}
      handleSignIn={handleSignIn}
      handleFileChange={handleFileChange}
      navigateTo={navigateTo}
      adminNgos={adminNgos}
    />
  );
}

export default App;
