const Donation = require('../models/Donation');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const fallbackDb = require('../config/fallbackDb');

// @desc    Book a new Donation
// @route   POST /api/donations
// @access  Public (Member)
exports.createDonation = async (req, res) => {
  try {
    const { title, category, donor, donorEmail, ngo, location, description, instructions, photo, deliveryMode } = req.body;

    if (!title || !category || !donor || !donorEmail || !ngo || !location) {
      return res.status(400).json({ error: 'Missing required donation booking fields.' });
    }

    if (!global.isDbConnected) {
      const newDonation = fallbackDb.saveDonation({
        ...req.body,
        courier: deliveryMode === 'Self' ? 'Self (Donor Delivery)' : 'None (Awaiting Courier)'
      });
      fallbackDb.saveLog(`Member "${donor}" booked new donation: "${title}" for "${ngo}"`, 'Action');
      return res.status(201).json(newDonation);
    }

    const newDonation = new Donation({
      title,
      category,
      donor,
      donorEmail,
      ngo,
      location,
      description,
      instructions,
      photo,
      deliveryMode,
      courier: deliveryMode === 'Self' ? 'Self (Donor Delivery)' : 'None (Awaiting Courier)'
    });

    await newDonation.save();

    // Log the donation booking in System Audits
    const newLog = new AuditLog({
      event: `Member "${donor}" booked new donation: "${title}" for "${ngo}"`,
      category: 'Action'
    });
    await newLog.save();

    res.status(201).json(newDonation);
  } catch (error) {
    console.error('createDonation Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Fetch all booked Donations
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const donations = fallbackDb.getDonations();
      return res.status(200).json(donations);
    }

    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error('getDonations Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Accept a Donation offer
// @route   PUT /api/donations/:id/accept
// @access  Public (NGO)
exports.acceptDonation = async (req, res) => {
  try {
    const { ngo } = req.body;
    if (!ngo) {
      return res.status(400).json({ error: 'NGO name is required.' });
    }

    // Backend Safety Lock: Verify that the accepting NGO is Approved
    if (!global.isDbConnected) {
      const allUsers = fallbackDb.getUsers();
      const matchedNgo = allUsers.find(u => u.role === 'NGO' && u.ngoName === ngo);
      if (matchedNgo && matchedNgo.status !== 'Approved') {
        return res.status(403).json({ 
          error: `Your NGO profile status is currently "${matchedNgo ? matchedNgo.status : 'Pending'}". You cannot accept donation offers until approved by the administrator.` 
        });
      }
    } else {
      const matchedNgo = await User.findOne({ role: 'NGO', ngoName: ngo });
      if (matchedNgo && matchedNgo.status !== 'Approved') {
        return res.status(403).json({ 
          error: `Your NGO profile status is currently "${matchedNgo ? matchedNgo.status : 'Pending'}". You cannot accept donation offers until approved by the administrator.` 
        });
      }
    }

    if (!global.isDbConnected) {
      const updates = { status: 'Accepted' };
      if (ngo) {
        updates.ngo = ngo;
      }
      const donation = fallbackDb.updateDonation(req.params.id, updates);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }
      fallbackDb.saveLog(`NGO "${donation.ngo}" accepted donation offer "${donation.title}"`, 'Action');
      return res.status(200).json(donation);
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    if (ngo) {
      donation.ngo = ngo;
    }
    donation.status = 'Accepted';
    await donation.save();

    // Log offer acceptance in System Audits
    const newLog = new AuditLog({
      event: `NGO "${donation.ngo}" accepted donation offer "${donation.title}"`,
      category: 'Action'
    });
    await newLog.save();

    res.status(200).json(donation);
  } catch (error) {
    console.error('acceptDonation Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Claim or Release a Volunteer Delivery Run
// @route   PUT /api/donations/:id/claim
// @access  Public (Volunteer/Member)
exports.claimDonationRun = async (req, res) => {
  try {
    const { volunteerName } = req.body;
    if (!volunteerName) {
      return res.status(400).json({ error: 'Volunteer name is required.' });
    }

    if (!global.isDbConnected) {
      const donation = fallbackDb.findDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      const isCurrentlyClaimed = donation.courier && donation.courier.startsWith(volunteerName);
      let updates = {};

      if (isCurrentlyClaimed) {
        // Release Task
        updates = {
          status: 'Accepted',
          courier: 'None (Awaiting Courier)'
        };
        fallbackDb.updateDonation(req.params.id, updates);
        fallbackDb.saveLog(`Volunteer "${volunteerName}" released delivery run for "${donation.title}"`, 'Delivery');
      } else {
        // Claim Task (Locked for OTP pickup verification)
        updates = {
          status: 'Accepted',
          courier: `${volunteerName} (Claimed - Awaiting Pickup)`
        };
        fallbackDb.updateDonation(req.params.id, updates);
        fallbackDb.saveLog(`Volunteer "${volunteerName}" claimed delivery run for "${donation.title}" (Awaiting OTP)`, 'Delivery');
      }

      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    const isCurrentlyClaimed = donation.courier && donation.courier.startsWith(volunteerName);

    if (isCurrentlyClaimed) {
      // Release Task
      donation.status = 'Accepted';
      donation.courier = 'None (Awaiting Courier)';
      await donation.save();

      // Log release in System Audits
      const newLog = new AuditLog({
        event: `Volunteer "${volunteerName}" released delivery run for "${donation.title}"`,
        category: 'Delivery'
      });
      await newLog.save();
    } else {
      // Claim Task
      donation.status = 'Accepted';
      donation.courier = `${volunteerName} (Claimed - Awaiting Pickup)`;
      await donation.save();

      // Log claim in System Audits
      const newLog = new AuditLog({
        event: `Volunteer "${volunteerName}" claimed delivery run for "${donation.title}" (Awaiting OTP)`,
        category: 'Delivery'
      });
      await newLog.save();
    }

    res.status(200).json(donation);
  } catch (error) {
    console.error('claimDonationRun Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Mark a claimed run as Delivered
// @route   PUT /api/donations/:id/complete
// @access  Public (Volunteer/Member)
exports.completeDonationDelivery = async (req, res) => {
  try {
    const { volunteerName } = req.body;
    if (!volunteerName) {
      return res.status(400).json({ error: 'Volunteer name is required.' });
    }

    if (!global.isDbConnected) {
      const donation = fallbackDb.findDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      const updates = {
        status: 'Delivered',
        courier: `${volunteerName} (Completed)`
      };
      fallbackDb.updateDonation(req.params.id, updates);
      fallbackDb.saveLog(`Delivery completed for "${donation.title}" by "${volunteerName}"`, 'Delivery');

      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    donation.status = 'Delivered';
    donation.courier = `${volunteerName} (Completed)`;
    await donation.save();

    // Log completion in System Audits
    const newLog = new AuditLog({
      event: `Delivery completed for "${donation.title}" by "${volunteerName}"`,
      category: 'Delivery'
    });
    await newLog.save();

    res.status(200).json(donation);
  } catch (error) {
    console.error('completeDonationDelivery Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Verify OTP and start transit for pickup
// @route   PUT /api/donations/:id/verify-pickup
// @access  Public (Volunteer/Member)
exports.verifyPickup = async (req, res) => {
  try {
    const { otp, volunteerName } = req.body;
    if (!otp) {
      return res.status(400).json({ error: 'Verification OTP is required.' });
    }
    if (!volunteerName) {
      return res.status(400).json({ error: 'Volunteer name is required.' });
    }

    if (!global.isDbConnected) {
      const donation = fallbackDb.findDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }

      if (donation.otp !== otp) {
        return res.status(400).json({ error: 'Incorrect pickup verification OTP. Please verify with the donor.' });
      }

      const updates = {
        status: 'In Transit',
        courier: `${volunteerName} (Active)`
      };
      fallbackDb.updateDonation(req.params.id, updates);
      fallbackDb.saveLog(`Pickup verified & transit started for "${donation.title}" by "${volunteerName}"`, 'Delivery');

      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    if (donation.otp !== otp) {
      return res.status(400).json({ error: 'Incorrect pickup verification OTP. Please verify with the donor.' });
    }

    donation.status = 'In Transit';
    donation.courier = `${volunteerName} (Active)`;
    await donation.save();

    // Log verification in System Audits
    const newLog = new AuditLog({
      event: `Pickup verified & transit started for "${donation.title}" by "${volunteerName}"`,
      category: 'Delivery'
    });
    await newLog.save();

    res.status(200).json(donation);
  } catch (error) {
    console.error('verifyPickup Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Start self-transit for a donation
// @route   PUT /api/donations/:id/self-transit
// @access  Public (Donor Member)
exports.startSelfTransit = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const donation = fallbackDb.findDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }
      const updates = {
        status: 'In Transit'
      };
      fallbackDb.updateDonation(req.params.id, updates);
      fallbackDb.saveLog(`Donor started self-delivery transit for "${donation.title}"`, 'Delivery');
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    donation.status = 'In Transit';
    await donation.save();

    const newLog = new AuditLog({
      event: `Donor started self-delivery transit for "${donation.title}"`,
      category: 'Delivery'
    });
    await newLog.save();

    res.status(200).json(donation);
  } catch (error) {
    console.error('startSelfTransit Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Complete self-delivery for a donation
// @route   PUT /api/donations/:id/self-complete
// @access  Public (Donor Member)
exports.completeSelfDelivery = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const donation = fallbackDb.findDonationById(req.params.id);
      if (!donation) {
        return res.status(404).json({ error: 'Donation record not found.' });
      }
      const updates = {
        status: 'Delivered'
      };
      fallbackDb.updateDonation(req.params.id, updates);
      fallbackDb.saveLog(`Self-delivery completed for "${donation.title}" by Donor`, 'Delivery');
      const updatedDonation = fallbackDb.findDonationById(req.params.id);
      return res.status(200).json(updatedDonation);
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    donation.status = 'Delivered';
    await donation.save();

    const newLog = new AuditLog({
      event: `Self-delivery completed for "${donation.title}" by Donor`,
      category: 'Delivery'
    });
    await newLog.save();

    res.status(200).json(donation);
  } catch (error) {
    console.error('completeSelfDelivery Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

