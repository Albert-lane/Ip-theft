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

const landpadSchema = new mongoose.Schema({
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
  type: {
    type: String,
    default: null,
  },
  locality: {
    type: String,
    default: null,
  },
  region: {
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
  landing_attempts: {
    type: Number,
    default: 0,
  },
  landing_successes: {
    type: Number,
    default: 0,
  },
  wikipedia: {
    type: String,
    default: null,
  },
  details: {
    type: String,
    default: null,
  },
  launches: [{
    type: mongoose.ObjectId,
    ref: 'Launch',
  }],
  images: {
    large: [String],
  },
}, { autoCreate: true });

const index = {
  name: 'text',
  full_name: 'text',
  details: 'text',
};
landpadSchema.index(index);

landpadSchema.plugin(mongoosePaginate);
landpadSchema.plugin(idPlugin);

const Landpad = mongoose.model('Landpad', landpadSchema);

export default Landpad;
