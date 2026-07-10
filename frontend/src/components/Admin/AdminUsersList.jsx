// frontend/src/components/Admin/AdminUsersList.jsx
import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { SectionHeader } from '../UI/SectionHeader';
import { Table } from '../UI/Table';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';

export function AdminUsersList({
  adminUsers,
  adminSearchQuery,
  setAdminSearchQuery,
  setSelectedDossier,
  handleDeleteUser
}) {
  const filteredUsers = adminUsers.filter(user => 
    user.fullName.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  const tableHeaders = [
    { label: 'Full Name' },
    { label: 'Contact Info' },
    { label: 'Active Profile Roles' },
    { label: 'Joined Date' },
    { label: 'Actions', className: 'text-center' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader 
        title="REGISTERED MEMBERS" 
        subtitle="Audit active profiles, donation/volunteer logs, and contact vectors."
        icon="👥"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search user name, email..."
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            className="bg-white border border-[#0F340F]/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#78A642] text-[#0F340F] shadow-sm w-64 placeholder-[#556B5D]/40"
          />
          <Search className="w-4 h-4 text-[#556B5D]/40 absolute left-3 top-2.5" />
        </div>
      </SectionHeader>

      <Table headers={tableHeaders}>
        {filteredUsers.map(user => (
          <tr key={user._id || user.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
            <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
              {user.fullName}
            </td>
            <td className="px-6 py-4 font-medium leading-normal text-xs text-[#556B5D]">
              <p>📧 {user.email}</p>
              <p>📞 {user.phone}</p>
              <p className="text-[10px] text-[#556B5D]/60 mt-0.5">📍 {user.location}</p>
            </td>
            <td className="px-6 py-4">
              <Badge status={user.role} />
            </td>
            <td className="px-6 py-4 font-medium text-xs text-[#556B5D]">
              {user.joinedDate}
            </td>
            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedDossier({ type: 'Member', data: user })}
                  className="border border-[#0F340F]/10 text-[10px] px-2.5 py-1.5 rounded-xl font-bold"
                >
                  🔍 View Dossier
                </Button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you absolutely sure you want to permanently delete Member "${user.fullName}" from the registry?`)) {
                      handleDeleteUser(user._id || user.id);
                    }
                  }}
                  className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
