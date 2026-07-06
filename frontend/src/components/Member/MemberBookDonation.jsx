import React from 'react';
import { Upload, Truck, User, CheckCircle } from 'lucide-react';
import { InteractiveBookingPinMap } from '../Map/InteractiveBookingPinMap';

export function MemberBookDonation({
  currentMember,
  newBooking,
  setNewBooking,
  bookingSuccess,
  setBookingSuccess,
  handleBookingSubmit,
  donationCategories // pass as prop or define locally
}) {

  const defaultCategories = donationCategories || [];

  return (
    <div className="bg-white border border-[#0F340F]/8 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto shadow-sm text-left animate-fade-in">
      <h2 className="text-2xl font-extrabold text-[#0F340F] font-serif mb-2">📦 BOOK NEW DONATION</h2>
      <p className="text-xs text-[#576F5E] font-semibold mb-8">Follow our interactive form wizard to book a verified community pickup.</p>
      
      {newBooking.ngoName && newBooking.ngoName !== 'Common Pool' && (
        <div className="bg-[#F4F7F2] border border-[#78A642]/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#78A642]/10 flex items-center justify-center text-lg flex-shrink-0 select-none">
              🎁
            </div>
            <div>
              <h4 className="font-extrabold text-[#0F340F] text-xs uppercase tracking-wider">Fulfilling NGO Requirement</h4>
              <p className="text-xs text-[#576F5E] font-semibold leading-relaxed mt-0.5">
                This donation will be locked & delivered exclusively to <span className="font-bold text-[#0F340F] underline">{newBooking.ngoName}</span>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNewBooking({
              ...newBooking,
              step: 1,
              category: null,
              title: '',
              description: '',
              ngoName: 'Common Pool'
            })}
            className="bg-white border border-[#0F340F]/10 hover:border-red-200 text-[#0F340F] hover:text-red-600 font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer self-start sm:self-center"
          >
            Cancel / Standard Donation
          </button>
        </div>
      )}

      {bookingSuccess ? (
        <div className="text-center py-16 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-[#78A642]/10 flex items-center justify-center text-[#78A642]">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#0F340F] font-serif">Donation Submitted!</h3>
          <p className="text-sm text-[#576F5E] font-semibold">Your donation is logged and waiting for a volunteer driver to coordinate handoff.</p>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          
          {/* Step indicator */}
          <div className="flex items-center justify-between border-b border-[#0F340F]/5 pb-4">
            <span className="text-xs font-extrabold text-[#78A642] uppercase tracking-widest">Step {newBooking.step} of 4</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map(s => (
                <span key={s} className={`w-6 h-1.5 rounded-full ${newBooking.step >= s ? 'bg-[#78A642]' : 'bg-[#0F340F]/5'}`} />
              ))}
            </div>
          </div>

          {newBooking.step === 1 && (
            <div className="space-y-4">
              <label className="text-sm font-extrabold text-[#0F340F]">1. Choose Item Category:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {defaultCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  const isSelected = newBooking.category === cat.title;
                  return (
                    <div
                      key={idx}
                      onClick={() => setNewBooking({ ...newBooking, category: cat.title, step: 2 })}
                      className={`flex flex-col items-center justify-center border aspect-square p-4 rounded-2xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#0F340F] border-[#0F340F] text-white shadow-md' 
                          : 'bg-[#F8FAF5]/40 border-[#0F340F]/8 text-[#0F340F] hover:bg-white hover:border-[#78A642] hover:shadow-sm'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'text-[#0F340F]'}`} />
                      <span className="text-xs font-bold text-center leading-tight">{cat.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {newBooking.step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">2. Item Title:</label>
                <input 
                  type="text" 
                  required
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm"
                  placeholder="e.g. Warm wool blankets or Box of toys"
                />
              </div>
              <div>
                <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">3. Brief Details / Quantity:</label>
                <textarea 
                  rows="3"
                  required
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm resize-none"
                  placeholder="Describe the items, condition, and count..."
                />
              </div>
              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setNewBooking({ ...newBooking, step: 1 })}
                  className="px-6 py-2.5 rounded-full border border-[#0F340F]/15 text-[#0F340F] font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={() => { if (newBooking.title && newBooking.description) setNewBooking({ ...newBooking, step: 3 }) }}
                  className="px-6 py-2.5 rounded-full bg-[#0F340F] hover:bg-[#0A230A] text-white font-bold text-xs cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {newBooking.step === 3 && (
            <div className="space-y-5">
              <label className="text-sm font-extrabold text-[#0F340F] block">3. Upload Handoff Verification Photo:</label>
              <span className="text-[11px] text-[#576F5E] font-semibold -mt-3 block">
                (A quick photo of the packed items aids volunteer loading and helps the NGO verify size and volume)
              </span>
              <div className="relative border border-dashed border-[#78A642]/40 rounded-2xl py-8 px-4 flex flex-col items-center justify-center bg-[#78A642]/5 group hover:bg-[#78A642]/10 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewBooking({ ...newBooking, photo: e.target.files[0], photoName: e.target.files[0].name, step: 4 });
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-[#78A642] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#0F340F]">
                  {newBooking.photoName ? newBooking.photoName : "Click to select or drop verification photo"}
                </span>
                <span className="text-[10px] text-[#576F5E] font-semibold mt-1">supports jpg, png (Max size: 5MB)</span>
              </div>
              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setNewBooking({ ...newBooking, step: 2 })}
                  className="px-6 py-2.5 rounded-full border border-[#0F340F]/15 text-[#0F340F] font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={() => setNewBooking({ ...newBooking, step: 4 })}
                  className="px-6 py-2.5 rounded-full bg-[#0F340F] hover:bg-[#0A230A] text-white font-bold text-xs cursor-pointer"
                >
                  Skip Photo
                </button>
              </div>
            </div>
          )}

          {newBooking.step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-extrabold text-[#0F340F] block mb-2">4. Select Delivery Mode:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setNewBooking({ ...newBooking, deliveryMode: 'Volunteer' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      newBooking.deliveryMode !== 'Self'
                        ? 'border-[#78A642] bg-[#F8FAF5]'
                        : 'border-[#0F340F]/15 hover:border-[#0F340F]/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#78A642]" />
                      <span className="font-extrabold text-sm text-[#0F340F]">Volunteer Delivery</span>
                    </div>
                    <p className="text-[11px] text-[#556B5D] font-semibold mt-1">
                      A registered volunteer courier will pick up the package from your door.
                    </p>
                  </div>

                  <div 
                    onClick={() => setNewBooking({ ...newBooking, deliveryMode: 'Self' })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      newBooking.deliveryMode === 'Self'
                        ? 'border-[#78A642] bg-[#F8FAF5]'
                        : 'border-[#0F340F]/15 hover:border-[#0F340F]/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#78A642]" />
                      <span className="font-extrabold text-sm text-[#0F340F]">Self Deliver</span>
                    </div>
                    <p className="text-[11px] text-[#556B5D] font-semibold mt-1">
                      You will drop off the items at the NGO's coordinates yourself.
                    </p>
                  </div>
                </div>
              </div>

              {newBooking.deliveryMode !== 'Self' ? (
                <>
                  <div>
                    <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">5. Pickup Coordinates / Address:</label>
                    <input 
                      type="text" 
                      required
                      value={newBooking.address}
                      onChange={(e) => setNewBooking({ ...newBooking, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm"
                      placeholder="Primary home address"
                    />
                  </div>
                  <InteractiveBookingPinMap value={newBooking.address} memberLocation={currentMember?.location} onChange={(val) => setNewBooking({ ...newBooking, address: val })} />
                  <div>
                    <label className="text-sm font-extrabold text-[#0F340F] block mb-1.5">6. Driver Pickup Access Notes (Optional):</label>
                    <input 
                      type="text" 
                      value={newBooking.instructions}
                      onChange={(e) => setNewBooking({ ...newBooking, instructions: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#0F340F]/15 focus:ring-2 focus:ring-[#0F340F]/20 focus:outline-none font-medium text-sm"
                      placeholder="e.g. Ring buzzer 3B. Leave at gate if not answered."
                    />
                  </div>
                </>
              ) : (
                <div className="p-4 bg-[#F8FAF5] border border-[#78A642]/20 rounded-2xl text-[#0F340F] text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                  <span className="text-base">🙋‍♂️</span>
                  <div>
                    <p className="font-bold text-[#0F340F]">Drop-off coordinates locked to the NGO facility.</p>
                    <p className="text-[#556B5D] mt-0.5">Since you chose Self Deliver, you will transport the package yourself. No volunteer courier will arrive at your home.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => setNewBooking({ ...newBooking, step: 3 })}
                  className="px-6 py-2.5 rounded-full border border-[#0F340F]/15 text-[#0F340F] font-bold text-xs cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#78A642] hover:bg-[#638B34] text-white font-bold text-sm cursor-pointer shadow-md transition-all"
                >
                  ❤️ SUBMIT REQUEST
                </button>
              </div>
            </div>
          )}

        </form>
      )}
    </div>
  );
}
