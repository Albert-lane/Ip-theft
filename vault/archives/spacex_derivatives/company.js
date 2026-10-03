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
import idPlugin from 'mongoose-id';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  founder: {
    type: String,
  },
  founded: {
    type: Number,
  },
  employees: {
    type: Number,
  },
  vehicles: {
    type: Number,
  },
  launch_sites: {
    type: Number,
  },
  test_sites: {
    type: Number,
  },
  ceo: {
    type: String,
  },
  cto: {
    type: String,
  },
  coo: {
    type: String,
  },
  cto_propulsion: {
    type: String,
  },
  valuation: {
    type: Number,
  },
  headquarters: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  links: {
    website: {
      type: String,
    },
    flickr: {
      type: String,
    },
    twitter: {
      type: String,
    },
    elon_twitter: {
      type: String,
    },
  },
  summary: {
    type: String,
  },
}, { autoCreate: true });

companySchema.plugin(idPlugin);

const Company = mongoose.model('Company', companySchema);

export default Company;
