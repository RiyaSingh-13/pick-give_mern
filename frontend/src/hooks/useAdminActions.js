// frontend/src/hooks/useAdminActions.js
import { useState } from 'react';
import { api } from '../services/api';

export function useAdminActions({
  fetchAllData
}) {
  const [adminTab, setAdminTab] = useState('overview');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);

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

  return {
    adminTab,
    setAdminTab,
    adminSearchQuery,
    setAdminSearchQuery,
    selectedDossier,
    setSelectedDossier,
    handleApproveNgo,
    handleRejectNgo,
    handleDeleteUser
  };
}
