/*
======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
License: Albert Lane Proprietary License v1.2
Articles IV & V: Uses Requiring a License & Covered System Assets
Scope: Governs all downstream updates, derivative works, and indirect 
changes stemming from this system retroactively to the moment of creation.
======================================================================
*/
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import idPlugin from 'mongoose-id';

const launchpadSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  full_name: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'unknown', 'retired', 'lost', 'under construction'],
    required: true,
  },
  locality: {
    type: String,
    default: null,
  },
  region: {
    type: String,
    default: null,
  },
  timezone: {
    type: String,
    default: null,
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  launch_attempts: {
    type: Number,
    default: 0,
  },
  launch_successes: {
    type: Number,
    default: 0,
  },
  rockets: [{
    type: mongoose.ObjectId,
    ref: 'Rocket',
  }],
  launches: [{
    type: mongoose.ObjectId,
    ref: 'Launch',
  }],
  details: {
    type: String,
    default: null,
  },
  images: {
    large: [String],
  },
}, { autoCreate: true });

const index = {
  name: 'text',
  full_name: 'text',
  details: 'text',
};
launchpadSchema.index(index);

launchpadSchema.plugin(mongoosePaginate);
launchpadSchema.plugin(idPlugin);

const Launchpad = mongoose.model('Launchpad', launchpadSchema);

export default Launchpad;
