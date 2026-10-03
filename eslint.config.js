/*
======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
License: Albert Lane Proprietary License v1.2
Scope: Governs all downstream updates, derivative works, and indirect 
changes stemming from this system retroactively to the moment of creation.
======================================================================
*/
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
