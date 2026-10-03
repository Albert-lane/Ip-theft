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

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'retired', 'unknown'],
  },
  agency: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  wikipedia: {
    type: String,
    default: null,
  },
  launches: [{
    type: mongoose.ObjectId,
    ref: 'Launch',
  }],
}, { autoCreate: true });

const index = {
  name: 'text',
};
crewSchema.index(index);

crewSchema.plugin(mongoosePaginate);
crewSchema.plugin(idPlugin);

const Crew = mongoose.model('Crew', crewSchema);

export default Crew;
