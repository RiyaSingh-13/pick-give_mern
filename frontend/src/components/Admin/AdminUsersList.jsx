import React from 'react';
import { Search, Trash2 } from 'lucide-react';

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

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#0F340F]/10 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif">👥 REGISTERED MEMBERS</h2>
          <p className="text-xs font-semibold text-[#556B5D] mt-1">Audit active profiles, donation/volunteer logs, and contact vectors.</p>
        </div>
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
      </div>

      <div className="bg-white border border-[#0F340F]/8 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-[#556B5D] divide-y divide-[#0F340F]/5">
            <thead className="bg-[#F8FAF5] text-[#0F340F] text-[10px] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Active Profile Roles</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F340F]/5">
              {filteredUsers.map(user => (
                <tr key={user._id || user.id} className="hover:bg-[#F8FAF5]/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0F340F] text-sm font-serif">
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 font-medium leading-normal">
                    <p>📧 {user.email}</p>
                    <p>📞 {user.phone}</p>
                    <p className="text-[10px] text-[#556B5D]/60 mt-0.5">📍 {user.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      user.role.includes('Volunteer')
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {user.joinedDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedDossier({ type: 'Member', data: user })}
                        className="bg-[#0F340F]/5 hover:bg-[#0F340F]/10 text-[#0F340F] text-[10px] font-black px-2.5 py-1.5 rounded-xl border border-[#0F340F]/10 transition-colors cursor-pointer"
                      >
                        🔍 View Dossier
                      </button>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
