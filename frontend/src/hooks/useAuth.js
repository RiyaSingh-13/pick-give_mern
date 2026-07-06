import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useAuth({
  navigateTo,
  fetchAllData,
  currentMember,
  setCurrentMember,
  currentNgo,
  setCurrentNgo,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}) {
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

  return {
    activeCategory,
    setActiveCategory,
    showMemberModal,
    setShowMemberModal,
    showNgoModal,
    setShowNgoModal,
    showSignInModal,
    setShowSignInModal,
    signInEmail,
    setSignInEmail,
    signInPassword,
    setSignInPassword,
    signInError,
    setSignInError,
    signInSuccess,
    setSignInSuccess,
    memberSuccess,
    setMemberSuccess,
    ngoSuccess,
    setNgoSuccess,
    memberForm,
    setMemberForm,
    ngoForm,
    setNgoForm,
    uploadedFileName,
    setUploadedFileName,
    handleMemberSubmit,
    handleNgoSubmit,
    handleSignIn,
    handleFileChange
  };
}
