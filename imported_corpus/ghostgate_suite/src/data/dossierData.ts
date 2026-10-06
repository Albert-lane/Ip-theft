// Copyright © Albert Lane. All Rights Reserved.
// Proprietary and Confidential — Albert Lane Proprietary Software License.
// Unauthorized use, copying, modification, or distribution is prohibited.
// License inquiries: https://albertlane.net/licensing
// SEC Whistleblower Reference: SEC-17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D

import { InvestigationTask, ForensicDossierItem, FederalContract, LitigationCase, DebtValuationItem, FOIARequestRecord } from '../types';
import { generateAlbertLaneProvenance } from '../utils/crypto';

export const INITIAL_TASKS: InvestigationTask[] = [
  {
    id: 'TASK-X-001',
    title: 'Audit $13B LBO Debt Covenants & Fidelity 78.7% Valuation Markdown Disclosures',
    description: 'Forensic reconciliation of X Corp $13 Billion leveraged buyout debt stack held across bank syndicate (Morgan Stanley, BofA, Barclays, MUFG) against quarterly mutual fund filings (Fidelity Blue Chip Growth Fund, Form N-PORT) disclosing carrying valuation markdowns of 78.7% to 84%.',
    scope: 'X_CORP',
    category: 'DEBT_COVENANT',
    priority: 'CRITICAL',
    status: 'ACTIVE_AUDIT',
    assignee: {
      name: 'Dr. Evelyn Vance',
      role: 'Principal Forensic Auditor',
      avatar: 'EV',
      nodeId: 'AL-NODE-01-SYNDICATE'
    },
    evidenceIds: ['EV-SEC-X-13B-LBO', 'EV-FIDELITY-NPORT-2024Q3'],
    merkleProof: '0x9a8f4c2e1b7d5a3f6e8c0b2d4f6a8e0c2b4d6f8a0c2e4a6f8b0d2e4f6a8c0e2b',
    provenance: generateAlbertLaneProvenance('TASK-X-001'),
    confidenceScore: 98,
    dollarImpact: 13000000000,
    timelineDate: '2024-09-30',
    regulatoryChannels: ['SEC_TCR', 'FINRA'],
    findingsSummary: 'Cross-audited Form N-PORT disclosures confirm 7 bank syndicates accrued ~$1.2B annual interest burden while advertising revenue fell by ~54% post-privatization, creating substantial risk of technical covenant breach under senior secured credit facility agreements.',
    contradictoryEvidence: 'X Corp executive assertions claimed operational cash-flow break-even in Q3 2023 without disclosing interest servicing exclusions.',
    sourceDocs: [
      {
        id: 'DOC-SEC-X-01',
        title: 'SEC Schedule 13D Amendment — Twitter / X Holdings I, Inc.',
        type: 'SEC_EDGAR',
        url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
        docketNumber: 'SEC CIK 0001495048',
        dateFiled: '2022-10-28',
        notes: 'Outlines $13B senior secured and unsecured bridge facility terms.'
      },
      {
        id: 'DOC-FID-01',
        title: 'Fidelity Central Investment Portfolios II (Form N-PORT Monthly Portfolio Holdings)',
        type: 'SEC_EDGAR',
        url: 'https://www.sec.gov/edgar/browse/?CIK=0000880195',
        exhibitId: 'NPORT-P-2024-09',
        dateFiled: '2024-09-30',
        notes: 'Carrying share price written down from original $54.20 acquisition basis to ~$11.50 per implied share.'
      }
    ],
    whistleblowerProtection: 'TCR_SEALED',
    comments: [
      {
        id: 'C-01',
        author: 'Marcus Brody, CPA',
        role: 'Debt Restructuring Specialist',
        text: 'Verified PIK (Payment-in-Kind) toggle provisions in the $3B mezzanine tranche. No default notice filed by trustee yet, but secondary bond trading sits at ~55-60 cents on dollar.',
        timestamp: '2026-09-18T14:22:00Z',
        verified: true
      }
    ],
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-10-02T11:45:00Z'
  },
  {
    id: 'TASK-SPX-002',
    title: 'NASA HLS Option A ($2.89B) & Option B ($1.15B) Milestone Mil-Spec & GAO Bid Protest Audit',
    description: 'Evaluate performance milestones and unliquidated progress payments under NASA Contract 80MSFC20C0034 (Human Landing System Option A & B) against GAO protest rulings (B-419783, Blue Origin & Dynetics protests) regarding sole-source selection and cryogenic propellant transfer safety waivers.',
    scope: 'SPACEX',
    category: 'CONTRACT_ANOMALY',
    priority: 'CRITICAL',
    status: 'VERIFIED_CHAIN',
    assignee: {
      name: 'Col. Raymond Shaw',
      role: 'Federal Contracting Compliance Lead',
      avatar: 'RS',
      nodeId: 'AL-NODE-04-AEROSPACE'
    },
    evidenceIds: ['EV-NASA-HLS-80MSFC', 'EV-GAO-B419783-RULING', 'EV-FAA-PEA-STARBASE'],
    merkleProof: '0x1c8b3f4a7e9d0c2b5e8a1f4d7b0c3e6a9f2d5b8c1e4a7d0f3c6b9e2a5d8f1c4b',
    provenance: generateAlbertLaneProvenance('TASK-SPX-002'),
    confidenceScore: 96,
    dollarImpact: 4040000000,
    timelineDate: '2024-11-15',
    regulatoryChannels: ['GAO', 'DOJ_CIVIL', 'HOUSE_OVERSIGHT'],
    findingsSummary: 'NASA Office of Inspector General (Report No. IG-24-001) highlighted 18-month Artemis III schedule slippage directly tied to Starship orbital refueling test delays; progress payments continue via milestone modifications under FAR Part 15.',
    contradictoryEvidence: 'NASA Source Selection Statement signed by Kathy Lueders asserted budgetary constraint forced single awardee selection over dual-award architecture.',
    sourceDocs: [
      {
        id: 'DOC-USA-01',
        title: 'USAspending.gov Prime Award Summary 80MSFC20C0034',
        type: 'SAM_GOV',
        awardId: '80MSFC20C0034',
        url: 'https://www.usaspending.gov/award/CONT_AWD_80MSFC20C0034_8000_-NONE-_-NONE-',
        dateFiled: '2021-04-16',
        notes: 'Original ceiling $2.89B with Option B modification adding $1.15B.'
      },
      {
        id: 'DOC-GAO-01',
        title: 'GAO Bid Protest Decision B-419783; B-419783.2; B-419783.3',
        type: 'GAO',
        url: 'https://www.gao.gov/products/b-419783,b-419783.2,b-419783.3',
        dateFiled: '2021-07-30',
        notes: '76-page ruling denying protests, confirming NASA evaluated only SpaceX within available appropriations.'
      }
    ],
    whistleblowerProtection: 'PUBLIC_INTEREST',
    comments: [
      {
        id: 'C-02',
        author: 'Dr. Evelyn Vance',
        role: 'Principal Forensic Auditor',
        text: 'FAA Part 450 vehicle operator license modifications for Flight 4 & Flight 5 cross-referenced with US Fish and Wildlife Service Biological Opinion addendum.',
        timestamp: '2026-09-29T16:10:00Z',
        verified: true
      }
    ],
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-10-03T09:12:00Z'
  },
  {
    id: 'TASK-XAI-003',
    title: 'xAI Form D ($6B Series B) Data Scraping & Grok Ingestion Intellectual Property Chain Audit',
    description: 'Analyze xAI Form D filings (SEC CIK 0001985959, $6.0B equity financing) in relation to data licensing agreements, terms of service alterations for real-time X Corp data ingestion, and copyright/trade secret misappropriation exposure.',
    scope: 'XAI',
    category: 'IP_THEFT',
    priority: 'HIGH',
    status: 'ACTIVE_AUDIT',
    assignee: {
      name: 'Aria Sterling, JD',
      role: 'Intellectual Property Counsel',
      avatar: 'AS',
      nodeId: 'AL-NODE-07-IP-VALUATION'
    },
    evidenceIds: ['EV-XAI-FORMD-SEC', 'EV-TOS-SEPT2023-AMEND', 'EV-MEMPHIS-TVA-100K'],
    merkleProof: '0x4f2a7b9c1d3e5f8a0b2d4c6e8a0f2b4d6c8e0a2f4b6d8c0e2a4f6b8d0c2e4a6f',
    provenance: generateAlbertLaneProvenance('TASK-XAI-003'),
    confidenceScore: 92,
    dollarImpact: 6000000000,
    timelineDate: '2024-05-26',
    regulatoryChannels: ['SEC_TCR', 'DOJ_CIVIL'],
    findingsSummary: 'Evidence confirms xAI utilizes unified infrastructure and proprietary data streams originating from X Corp without formal arms-length audited intercompany transfer pricing agreements or independent fairness opinions for minority X shareholders.',
    contradictoryEvidence: 'Corporate filings state xAI and X Corp maintain mutual data-sharing and compute reciprocity agreements.',
    sourceDocs: [
      {
        id: 'DOC-XAI-01',
        title: 'SEC Form D Notice of Exempt Offering of Securities (xAI Holdings Co.)',
        type: 'SEC_EDGAR',
        url: 'https://www.sec.gov/edgar/browse/?CIK=0001985959',
        docketNumber: 'CIK 0001985959 / Accession 0001985959-24-000002',
        dateFiled: '2024-05-24',
        notes: '$6,000,000,000 total offering amount, equity type, with Valor Equity Partners, Vy Capital, Fidelity.'
      }
    ],
    whistleblowerProtection: 'PROTECTED_WITNESS',
    comments: [],
    createdAt: '2026-09-01T12:00:00Z',
    updatedAt: '2026-10-01T17:30:00Z'
  },
  {
    id: 'TASK-DOGE-004',
    title: 'DOGE FACA Legal Authority, 18 U.S.C. § 208 Conflicts & Treasury Payment System Access Audit',
    description: 'Examine constitutional and statutory framework of the Department of Government Efficiency under the Federal Advisory Committee Act (FACA, 5 U.S.C. App. 2), Anti-Deficiency Act (31 U.S.C. § 1341), Title 31 Treasury Financial Management, and OGE 278e conflict of interest recusals.',
    scope: 'DOGE',
    category: 'TREASURY_OVERSIGHT',
    priority: 'CRITICAL',
    status: 'ACTIVE_AUDIT',
    assignee: {
      name: 'Elena Rostova',
      role: 'Constitutional & Administrative Law Senior Fellow',
      avatar: 'ER',
      nodeId: 'AL-NODE-09-CONSTITUTIONAL'
    },
    evidenceIds: ['EV-OGE-278E-DISCLOSURES', 'EV-FACA-CHARTER-DOCKET', 'EV-TREASURY-PAM-ACCESS'],
    merkleProof: '0x7e0d2c4b6a8f1e3a5c7b9d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a',
    provenance: generateAlbertLaneProvenance('TASK-DOGE-004'),
    confidenceScore: 94,
    dollarImpact: 2000000000000,
    timelineDate: '2025-01-20',
    regulatoryChannels: ['HOUSE_OVERSIGHT', 'GAO', 'DOJ_CIVIL'],
    findingsSummary: 'Congressional Research Service (CRS) legal memorandum and GAO precedent confirm non-Senate-confirmed advisory bodies cannot execute statutory payment halts or access non-public Treasury Payment Automation Manager (PAM) databases without formal delegation order.',
    contradictoryEvidence: 'Executive branch memoranda assert DOGE operates purely as an advisory modernization task force under Presidential reorganization authority.',
    sourceDocs: [
      {
        id: 'DOC-OGE-01',
        title: 'Office of Government Ethics (OGE Form 278e) Public Financial Disclosure Tracking',
        type: 'OIG',
        url: 'https://www.oge.gov/web/oge.nsf/Officials',
        dateFiled: '2025-02-01',
        notes: 'Review of recusals and 18 U.S.C. 208(b) statutory waivers for commercial contractors.'
      },
      {
        id: 'DOC-GAO-TREAS',
        title: 'GAO Principles of Federal Appropriations Law (The Red Book, Vol. II)',
        type: 'GAO',
        url: 'https://www.gao.gov/legal/appropriations-law',
        dateFiled: '2025-01-15',
        notes: 'Enforcement mechanisms governing Anti-Deficiency Act violations.'
      }
    ],
    whistleblowerProtection: 'ANONYMOUS_ENCRYPTED',
    comments: [],
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-10-04T10:15:00Z'
  },
  {
    id: 'TASK-RET-005',
    title: 'Whistleblower Retaliation & Non-Disclosure Enforcement Suppression Injunction Dossier',
    description: 'Document and counter systematic suppression tactics, weaponized non-disparagement agreements, NLRB Section 7/8(a)(1) violations (McLaren Macomb precedent), and retaliatory legal actions filed against former engineers, safety inspectors, and accounting personnel.',
    scope: 'CROSS_INFRA',
    category: 'WHISTLEBLOWER_RETALIATION',
    priority: 'CRITICAL',
    status: 'TRIAGE',
    assignee: {
      name: 'Dr. Evelyn Vance',
      role: 'Principal Forensic Auditor',
      avatar: 'EV',
      nodeId: 'AL-NODE-01-SYNDICATE'
    },
    evidenceIds: ['EV-NLRB-ND-CAL-0381', 'EV-OSHA-WHISTLEBLOWER-11C', 'EV-DELAWARE-SEALED-091'],
    merkleProof: '0x3c5e7a9b1d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4a6f8b0d2e4f6a8c0e2b4d',
    provenance: generateAlbertLaneProvenance('TASK-RET-005'),
    confidenceScore: 97,
    dollarImpact: 450000000,
    timelineDate: '2024-08-14',
    regulatoryChannels: ['DOJ_CIVIL', 'SEC_TCR', 'HOUSE_OVERSIGHT'],
    findingsSummary: 'Over 14 distinct OSHA Section 11(c) and SEC Rule 21F-17 whistleblower suppression actions identified across aerospace and social media entities, including restrictive severance clauses penalizing regulatory reporting.',
    contradictoryEvidence: 'Corporate human resources filings argue standard IP confidentiality clauses do not explicitly preclude law enforcement communications.',
    sourceDocs: [
      {
        id: 'DOC-NLRB-01',
        title: 'NLRB Region 31 Complaint & Notice of Hearing (Case 31-CA-307446)',
        type: 'PACER',
        url: 'https://www.nlrb.gov/case/31-CA-307446',
        docketNumber: '31-CA-307446',
        dateFiled: '2024-01-03',
        notes: 'Alleges unlawful termination and interrogation of 8 engineers for open letter criticizing management.'
      }
    ],
    whistleblowerProtection: 'TCR_SEALED',
    comments: [],
    createdAt: '2026-09-25T15:00:00Z',
    updatedAt: '2026-10-04T08:00:00Z'
  }
];

export const FORENSIC_DOSSIER_ITEMS: ForensicDossierItem[] = [
  {
    id: 'DOS-001',
    scope: 'X_CORP',
    entity: 'X Corp (formerly Twitter, Inc.)',
    action: '$13.0 Billion Leveraged Buyout Senior Debt Placement Across 7 Bank Syndicate',
    dollarAmount: 13000000000,
    sourceDoc: 'SEC Schedule 13D/A & Form 8-K',
    sourceType: 'SEC_EDGAR',
    exhibitId: 'EX-99.1-DEBT-COMMITMENT',
    pacerDocket: 'SEC CIK 0001495048',
    date: '2022-10-27',
    status: 'Audited',
    confidenceScore: 99,
    provenanceHash: '0x88f12a39bcde0192837465fecba0918273645e987123450987612345abcdef01',
    contradictoryEvidence: 'Original debt syndicate underwritten at par ($100), currently held at estimated ~60% discount on bank balance sheets.',
    verifiedByAgent: 'Albert Lane Provenance Node AL-01',
    regulatoryChannel: 'SEC_TCR',
    details: 'Senior secured credit facility: $6.5B term loan, $500M revolving credit, $3.0B secured bridge loans, and $3.0B unsecured bridge loans generating ~$1.2B annual cash interest expense.',
    isPubliclyDisclosed: true,
    undocumentedExploitFlag: false
  },
  {
    id: 'DOS-002',
    scope: 'X_CORP',
    entity: 'X Corp',
    action: 'FTC Consent Decree Ongoing Compliance & Security Governance Review (Docket C-4316)',
    dollarAmount: 150000000,
    sourceDoc: 'US District Court N.D. Cal. Docket 3:20-cv-03140 / FTC Consent Order',
    sourceType: 'PACER',
    exhibitId: 'FTC-ORD-2022-MOD',
    pacerDocket: '3:20-cv-03140-VC',
    date: '2022-05-25',
    status: 'Filed',
    confidenceScore: 98,
    provenanceHash: '0x11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff',
    contradictoryEvidence: 'X Corp filed motion to terminate or modify the 2022 administrative consent order alleging FTC overreach.',
    verifiedByAgent: 'Albert Lane Provenance Node AL-02',
    regulatoryChannel: 'DOJ_CIVIL',
    details: 'FTC 20-year consent order mandates comprehensive privacy and information security program with independent biannual third-party assessments following Peiter Zatko whistleblower disclosure.',
    isPubliclyDisclosed: true,
    undocumentedExploitFlag: false
  },
  {
    id: 'DOS-003',
    scope: 'SPACEX',
    entity: 'Space Exploration Technologies Corp.',
    action: 'NASA Artemis Human Landing System (HLS) Base + Option B Contract Award',
    dollarAmount: 4040000000,
    sourceDoc: 'USAspending Prime Award 80MSFC20C0034 / NASA Source Selection Statement',
    sourceType: 'SAM_GOV',
    awardId: '80MSFC20C0034',
    exhibitId: 'NASA-HLS-OPT-B',
    date: '2022-11-15',
    status: 'Audited',
    confidenceScore: 97,
    provenanceHash: '0x3344556677889900aabbccddeeff00112233445566778899aabbccddeeff0011',
    contradictoryEvidence: 'Blue Origin and Dynetics formal GAO bid protests alleged milestone evaluation inconsistencies regarding propellant transfer architecture.',
    verifiedByAgent: 'Albert Lane Provenance Node AL-04',
    regulatoryChannel: 'GAO',
    details: 'Firm-fixed-price milestone-based contract for uncrewed and crewed lunar surface demo missions (Artemis III & IV). Involves Starship orbital cryogenic refilling depot demonstration.',
    isPubliclyDisclosed: true,
    undocumentedExploitFlag: false
  },
  {
    id: 'DOS-004',
    scope: 'SPACEX',
    entity: 'Space Exploration Technologies Corp.',
    action: 'FAA Starbase Boca Chica Programmatic Environmental Assessment & Part 450 Launch License',
    dollarAmount: 250000000,
    sourceDoc: 'FAA Office of Commercial Space Transportation Final PEA & Mitigations',
    sourceType: 'FAA',
    exhibitId: 'FAA-PEA-2022-75ACT',
    date: '2022-06-13',
    status: 'Filed',
    confidenceScore: 95,
    provenanceHash: '0x556677889900aabbccddeeff00112233445566778899aabbccddeeff00112233',
    contradictoryEvidence: 'Environmental non-profit coalitions filed lawsuit (Case 1:23-cv-01204, D.D.C.) alleging FAA failed to require full Environmental Impact Statement (EIS).',
    verifiedByAgent: 'Albert Lane Provenance Node AL-05',
    regulatoryChannel: 'FAA_OIG',
    details: 'FAA issued Finding of No Significant Impact (FONSI) conditioned upon 75 specific environmental and wildlife mitigation actions around sensitive wetlands and coastal habitats.',
    isPubliclyDisclosed: true,
    undocumentedExploitFlag: false
  },
  {
    id: 'DOS-005',
    scope: 'XAI',
    entity: 'xAI Holdings Co. / xAI Corp',
    action: 'Series B Equity Financing ($6.0 Billion) & Colossus 100k H100 Supercluster Deployment',
    dollarAmount: 6000000000,
    sourceDoc: 'SEC Form D Notice of Exempt Offering of Securities',
    sourceType: 'SEC_EDGAR',
    exhibitId: 'SEC-FORMD-0001985959',
    pacerDocket: 'CIK 0001985959',
    date: '2024-05-24',
    status: 'Audited',
    confidenceScore: 99,
    provenanceHash: '0x77889900aabbccddeeff00112233445566778899aabbccddeeff001122334455',
    contradictoryEvidence: 'Private market valuations fluctuated between $18B pre-money and $24B post-money valuation baselines.',
    verifiedByAgent: 'Albert Lane Provenance Node AL-07',
    regulatoryChannel: 'SEC_TCR',
    details: '$6.0B capital raise from Andreessen Horowitz, Sequoia Capital, Fidelity Management, and Valor Equity Partners to finance 100,000 liquid-cooled Nvidia H100 GPU compute facility in Memphis, TN.',
    isPubliclyDisclosed: true,
    undocumentedExploitFlag: false
  },
  {
    id: 'DOS-006',
    scope: 'XAI',
    entity: 'xAI Corp & X Corp',
    action: 'Intercompany Model Training Pipeline & Scraping IP Ingestion Cross-Entity Analysis',
    dollarAmount: 1800000000,
    sourceDoc: 'X Corp Terms of Service Update / NYT v OpenAI Litigation Cross-Reference',
    sourceType: 'COURT_SEALED',
    exhibitId: 'IP-INGESTION-AUDIT-2024',
    date: '2024-07-15',
    status: 'Alleged',
    confidenceScore: 89,
    provenanceHash: '0x9900aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
    contradictoryEvidence: 'Terms of Service clause 3.2 grants platform broad license to utilize user-submitted public posts for machine learning model training.',
    verifiedByAgent: 'Albert Lane Provenance Node AL-08',
    regulatoryChannel: 'DOJ_CIVIL',
    details: 'Analysis of real-time tweet ingestion API pipelines routing high-frequency multimodal datasets to xAI Colossus clusters without audited royalty transfer pricing mechanisms.',
    isPubliclyDisclosed: false,
    undocumentedExploitFlag: true
  },
  {
    id: 'DOS-007',
    scope: 'DOGE',
    entity: 'Department of Government Efficiency (Advisory Council)',
    action: 'Executive Authority, Federal Advisory Committee Act (FACA) Compliance & Payment System Scrutiny',
    dollarAmount: 2000000000000,
    sourceDoc: '5 U.S.C. App. 2 / GAO Legal Opinion & CRS Appropriations Reports',
    sourceType: 'GAO',
    exhibitId: 'CRS-LEGAL-MEMO-2025',
    date: '2025-01-20',
    status: 'Filed',
    confidenceScore: 94,
    provenanceHash: '0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa',
    contradictoryEvidence: 'Public executive statements proclaimed authority to instantly cancel agency programs and pause Treasury disbursements without congressional rescission packages.',
    verifiedByAgent: 'Albert Lane Provenance Node AL-09',
    regulatoryChannel: 'HOUSE_OVERSIGHT',
    details: 'Impoundment Control Act of 1974 (2 U.S.C. § 681 et seq.) prohibits executive withholding of appropriated funds without formal special message rescission request approved by Congress within 45 days.',
    isPubliclyDisclosed: true,
    undocumentedExploitFlag: false
  },
  {
    id: 'DOS-008',
    scope: 'CROSS_INFRA',
    entity: 'Cloudflare / AWS GovCloud / Inter-Corporate Cloud Infrastructure',
    action: 'Ghost Gate Cryptographic Provenance Network Auditing & Ghost IP Block Logging',
    dollarAmount: 850000000,
    sourceDoc: 'Autonomous System AS13335 / AS16509 Routing & Ghost Gate Merkle Ledger',
    sourceType: 'TREASURY',
    exhibitId: 'GHOSTGATE-V13-PROVENANCE',
    date: '2026-10-04',
    status: 'Court_Sealed',
    confidenceScore: 99,
    provenanceHash: '0xddeeff00112233445566778899aabbccddeeff00112233445566778899aabbcc',
    contradictoryEvidence: 'Standard edge proxy routing logs typically discard client subnetwork hashes after 72 hours; Ghost Gate anchors Merkle proofs permanently.',
    verifiedByAgent: 'Albert Lane Provenance Master Root',
    regulatoryChannel: 'FINRA',
    details: 'Live cryptographic tamper-detection ledger anchoring all access attempts from corporate cloud blocks (34.*, 35.*, 52.*, 54.*, 20.*, 40.*) into immutable SHA-256 Merkle leaves to guarantee zero-tamper evidence chains.',
    isPubliclyDisclosed: false,
    undocumentedExploitFlag: true
  }
];

export const FEDERAL_CONTRACTS: FederalContract[] = [
  {
    awardId: '80MSFC20C0034',
    entity: 'Space Exploration Technologies Corp.',
    agency: 'NASA',
    subAgency: 'Marshall Space Flight Center',
    amount: 2890000000,
    date: '2021-04-16',
    description: 'Human Landing System (HLS) Option A Development & Crewed Lunar Surface Demonstration (Artemis III)',
    solicitationNumber: 'NNH19ZCQ001K_APPENDIX-H',
    naicsCode: '336414 (Guided Missile and Space Vehicle Manufacturing)',
    status: 'ACTIVE',
    anomalyRisk: 'LOW',
    anomalyDescription: 'Sole awardee following GAO bid protest denial B-419783.',
    samGovUrl: 'https://sam.gov/opp/NNH19ZCQ001K/view'
  },
  {
    awardId: '80MSFC20C0034-OPT-B',
    entity: 'Space Exploration Technologies Corp.',
    agency: 'NASA',
    subAgency: 'Marshall Space Flight Center',
    amount: 1150000000,
    date: '2022-11-15',
    description: 'Human Landing System (HLS) Option B Sustaining Lunar Development & Artemis IV Demonstration Mission',
    solicitationNumber: 'NNH19ZCQ001K_OPT_B',
    naicsCode: '336414',
    status: 'ACTIVE',
    anomalyRisk: 'MEDIUM',
    anomalyDescription: 'Contract modification exercised under sole-source justification FAR 6.302-1.',
    samGovUrl: 'https://sam.gov/opp/NNH19ZCQ001K_OPT_B/view'
  },
  {
    awardId: 'FA881120C0004',
    entity: 'Space Exploration Technologies Corp.',
    agency: 'Department of the Air Force',
    subAgency: 'Space Systems Command (SSC)',
    amount: 3160000000,
    date: '2020-08-07',
    description: 'National Security Space Launch (NSSL) Phase 2 Launch Service Procurement (Falcon 9 & Falcon Heavy)',
    solicitationNumber: 'FA8811-19-R-0002',
    naicsCode: '336414',
    status: 'ACTIVE',
    anomalyRisk: 'LOW',
    anomalyDescription: '60/40 competitive split award with United Launch Alliance (ULA).',
    samGovUrl: 'https://sam.gov/opp/FA8811-19-R-0002/view'
  },
  {
    awardId: 'W9113M23C0042',
    entity: 'Space Exploration Technologies Corp. (Starshield)',
    agency: 'Department of the Army / DoD',
    subAgency: 'Space and Missile Defense Command',
    amount: 70000000,
    date: '2023-09-22',
    description: 'Starshield Proliferated LEO Satellite Communications & Interoperability Defense Architecture',
    solicitationNumber: 'W9113M-23-R-0019',
    naicsCode: '517410 (Satellite Telecommunications)',
    status: 'ACTIVE',
    anomalyRisk: 'MEDIUM',
    anomalyDescription: 'Classified task orders under special access program provisions.',
    samGovUrl: 'https://sam.gov'
  },
  {
    awardId: '80KSC018C0012',
    entity: 'Space Exploration Technologies Corp.',
    agency: 'NASA',
    subAgency: 'Kennedy Space Center',
    amount: 2600000000,
    date: '2014-09-16',
    description: 'Commercial Crew Transportation Capability (CCtCap) Crew Dragon ISS Missions (Post-Cert Flights 1-14)',
    solicitationNumber: 'NNK14467515R',
    naicsCode: '336414',
    status: 'ACTIVE',
    anomalyRisk: 'LOW',
    anomalyDescription: 'Completed 9 operational crew rotations with 5 extensions.',
    samGovUrl: 'https://sam.gov'
  },
  {
    awardId: 'FA881124C0009',
    entity: 'Space Exploration Technologies Corp.',
    agency: 'Space Development Agency (SDA)',
    subAgency: 'Department of Defense',
    amount: 149000000,
    date: '2024-02-18',
    description: 'Tracking Layer Tranche 2 Proliferated Warfighter Space Architecture Launch Services',
    solicitationNumber: 'SDA-BAA-23-02',
    naicsCode: '336414',
    status: 'ACTIVE',
    anomalyRisk: 'LOW',
    samGovUrl: 'https://sam.gov'
  }
];

export const LITIGATION_CASES: LitigationCase[] = [
  {
    docketNumber: '3:22-cv-06881-JST',
    court: 'U.S. District Court, Northern District of California (San Francisco)',
    entity: 'X Corp (f/k/a Twitter, Inc.)',
    plaintiff: 'Cornet et al. (Former Twitter Employees)',
    defendant: 'Twitter, Inc. & X Corp',
    filingDate: '2022-11-03',
    status: 'ACTIVE',
    causeOfAction: 'Federal WARN Act (29 U.S.C. § 2101) & California WARN Act Violations (Mass Layoffs Without 60 Days Notice)',
    sealedDocsCount: 14,
    pacerUrl: 'https://www.courtlistener.com/docket/65697669/cornet-v-twitter-inc/',
    keyExhibits: ['Exhibit A: Severance Agreement Release Terms', 'Exhibit C: Internal Slack Notification Logs'],
    claimSummary: 'Consolidated class action alleging failure to provide statutory 60-day notice and full severance benefit payout promised under pre-merger change-in-control plans.',
    whistleblowerInvolved: true
  },
  {
    docketNumber: '1:23-cv-00508-RGA',
    court: 'U.S. District Court, District of Delaware',
    entity: 'X Corp',
    plaintiff: 'Crown Castle & Shorenstein Real Estate LLC',
    defendant: 'Twitter, Inc. / X Corp',
    filingDate: '2023-01-23',
    status: 'SETTLED',
    causeOfAction: 'Commercial Lease Default & Vendor Non-Payment ($136M Aggregated Landlord & Vendor Claims)',
    sealedDocsCount: 8,
    pacerUrl: 'https://www.courtlistener.com/docket/66779412/crown-castle-v-twitter/',
    keyExhibits: ['Exhibit 1: Master Lease Agreement', 'Exhibit 4: Notice of Default & Acceleration'],
    claimSummary: 'Landlord lawsuit regarding unpaid commercial rent at San Francisco Headquarters (1355 Market St) and regional data facility leases.',
    whistleblowerInvolved: false
  },
  {
    docketNumber: '2:24-cv-00712-CAS',
    court: 'U.S. District Court, Central District of California',
    entity: 'SpaceX',
    plaintiff: 'NLRB ex rel. Former Propulsion Engineers',
    defendant: 'Space Exploration Technologies Corp.',
    filingDate: '2024-01-08',
    status: 'ACTIVE',
    causeOfAction: 'National Labor Relations Act § 8(a)(1) & § 8(a)(3) Unfair Labor Practices & Retaliatory Discharge',
    sealedDocsCount: 22,
    pacerUrl: 'https://www.courtlistener.com/docket/68172901/nlrb-v-spacex/',
    keyExhibits: ['Exhibit 12: Internal Open Letter on Workplace Standards', 'Exhibit 19: Termination Interview Transcripts'],
    claimSummary: 'NLRB complaint alleging 8 engineers were fired in retaliation for co-authoring open letter on leadership culture. SpaceX counter-sued challenging NLRB constitutional structure.',
    whistleblowerInvolved: true
  },
  {
    docketNumber: '1:23-cv-01204-DLF',
    court: 'U.S. District Court, District of Columbia',
    entity: 'SpaceX / FAA',
    plaintiff: 'Center for Biological Diversity, American Bird Conservancy et al.',
    defendant: 'Federal Aviation Administration (SpaceX Intervenor-Defendant)',
    filingDate: '2023-05-01',
    status: 'ACTIVE',
    causeOfAction: 'National Environmental Policy Act (NEPA) Violation — Failure to Prepare Full Environmental Impact Statement',
    sealedDocsCount: 19,
    pacerUrl: 'https://www.courtlistener.com/docket/67312904/center-for-biological-diversity-v-faa/',
    keyExhibits: ['Exhibit 2: Starbase Boca Chica Launch Debris Radius Map', 'Exhibit 7: USFWS Biological Opinion Consultation'],
    claimSummary: 'Challenge to FAA Programmatic Environmental Assessment regarding environmental impact of Starship/Super Heavy orbital launch anomalies and debris scatter.',
    whistleblowerInvolved: false
  },
  {
    docketNumber: 'Case AT.40892',
    court: 'European Commission / European Court of Justice (Luxembourg)',
    entity: 'X Corp',
    plaintiff: 'European Commission Directorate-General for Communications Networks (DG CONNECT)',
    defendant: 'X Corp (EU Digital Services Act Designated VLOP)',
    filingDate: '2023-12-18',
    status: 'ACTIVE',
    causeOfAction: 'Digital Services Act (DSA) Regulation (EU) 2022/2065 Articles 34, 35, 40 (Deceptive UI & Researcher Data Access)',
    sealedDocsCount: 31,
    pacerUrl: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_24_3761',
    keyExhibits: ['Exhibit DSA-01: Blue Checkmark Verification Deception Analysis', 'Exhibit DSA-04: API Researcher Access Deprecation Log'],
    claimSummary: 'Formal proceedings examining deceptive blue check design, advertising repository transparency, and independent researcher access barriers under EU law with potential fines up to 6% of global turnover.',
    whistleblowerInvolved: false
  }
];

export const DEBT_VALUATION_DATA: DebtValuationItem[] = [
  {
    id: 'DEBT-01',
    entity: 'X Corp',
    instrument: 'Senior Secured Term Loan A (SOFR + 475 bps)',
    nominalValue: 6500000000,
    carryingValuation: 3900000000,
    discountPct: 40.0,
    holdingFund: 'Morgan Stanley, Bank of America, Barclays Syndicate',
    covenantStatus: 'FLAGGED',
    primaryFilingRef: 'SEC Schedule 13D/A / Syndicate Disclosures',
    interestRate: 'SOFR + 4.75% (Effective ~9.85%)',
    maturityDate: '2029-10-27',
    quarterlyTrend: [
      { quarter: '2023 Q1', markdownPct: 15.0 },
      { quarter: '2023 Q3', markdownPct: 28.0 },
      { quarter: '2024 Q1', markdownPct: 35.0 },
      { quarter: '2024 Q3', markdownPct: 40.0 }
    ]
  },
  {
    id: 'DEBT-02',
    entity: 'X Corp',
    instrument: 'Senior Secured Bridge Facility (11.00% Fixed Coupon)',
    nominalValue: 3000000000,
    carryingValuation: 1650000000,
    discountPct: 45.0,
    holdingFund: 'Bank Loan Syndicate (Held on Balance Sheet)',
    covenantStatus: 'FLAGGED',
    primaryFilingRef: 'Credit Agreement Exhibit 10.1',
    interestRate: '11.00% Fixed',
    maturityDate: '2030-04-15',
    quarterlyTrend: [
      { quarter: '2023 Q1', markdownPct: 20.0 },
      { quarter: '2023 Q3', markdownPct: 32.0 },
      { quarter: '2024 Q1', markdownPct: 41.0 },
      { quarter: '2024 Q3', markdownPct: 45.0 }
    ]
  },
  {
    id: 'DEBT-03',
    entity: 'X Corp',
    instrument: 'Senior Unsecured Bridge Facility (Floating High-Yield)',
    nominalValue: 3000000000,
    carryingValuation: 1350000000,
    discountPct: 55.0,
    holdingFund: 'MUFG, BNP Paribas, Mizuho Bank',
    covenantStatus: 'TECHNICAL_DEFAULT',
    primaryFilingRef: 'Syndicate Loan Agreement Schedule IV',
    interestRate: 'SOFR + 6.75% (Effective ~11.85%)',
    maturityDate: '2031-10-27',
    quarterlyTrend: [
      { quarter: '2023 Q1', markdownPct: 25.0 },
      { quarter: '2023 Q3', markdownPct: 42.0 },
      { quarter: '2024 Q1', markdownPct: 50.0 },
      { quarter: '2024 Q3', markdownPct: 55.0 }
    ]
  },
  {
    id: 'DEBT-04',
    entity: 'X Corp (Fidelity Equity Position)',
    instrument: 'Common Equity Shares (Acquisition Basis $54.20/sh)',
    nominalValue: 316000000,
    carryingValuation: 67300000,
    discountPct: 78.7,
    holdingFund: 'Fidelity Blue Chip Growth Fund (FBGRX / FBCGX)',
    covenantStatus: 'COMPLIANT',
    primaryFilingRef: 'SEC Form N-PORT Monthly Portfolio Schedule',
    interestRate: 'N/A (Equity Holding)',
    maturityDate: 'Perpetual',
    quarterlyTrend: [
      { quarter: '2023 Q1', markdownPct: 56.2 },
      { quarter: '2023 Q3', markdownPct: 65.4 },
      { quarter: '2024 Q1', markdownPct: 71.5 },
      { quarter: '2024 Q3', markdownPct: 78.7 }
    ]
  },
  {
    id: 'DEBT-05',
    entity: 'xAI Holdings Co.',
    instrument: 'Series B Convertible Preferred Stock',
    nominalValue: 6000000000,
    carryingValuation: 6000000000,
    discountPct: 0.0,
    holdingFund: 'Valor Equity Partners, Sequoia, Vy Capital, Fidelity',
    covenantStatus: 'COMPLIANT',
    primaryFilingRef: 'SEC Form D (CIK 0001985959)',
    interestRate: '8% Cumulative Dividend Preference',
    maturityDate: '2029-05-24',
    quarterlyTrend: [
      { quarter: '2024 Q2', markdownPct: 0.0 },
      { quarter: '2024 Q3', markdownPct: 0.0 },
      { quarter: '2024 Q4', markdownPct: 0.0 }
    ]
  }
];

export const FOIA_REQUEST_LIST: FOIARequestRecord[] = [
  {
    id: 'FOIA-2026-001',
    trackingNumber: 'FOIA-SEC-2026-00918',
    agency: 'U.S. Securities and Exchange Commission (SEC)',
    targetEntity: 'X Corp & xAI Holdings Co.',
    requestSubject: 'Intercompany Data Licensing & Royalty Agreements Between X Corp and xAI (2023-2026)',
    expeditedStatus: true,
    filingDate: '2026-08-14',
    status: 'IN_REVIEW',
    estimatedFulfillment: '2026-11-20',
    webhookSyncUrl: 'https://api.ghostgate.internal/foia/webhook/sec-00918',
    s3PayloadRef: 's3://ghostgate-audit-vault/foia/SEC-2026-00918-manifest.json',
    gapsTargeted: 'Absence of public arm\'s-length transfer pricing filings and minority equity shareholder fairness opinions.',
    generatedLetterText: `FREEDOM OF INFORMATION ACT (FOIA) REQUEST / 5 U.S.C. § 552
TO: SEC FOIA Office, 100 F Street NE, Washington, DC 20549
DATE: August 14, 2026
SUBJECT: EXPEDITED REQUEST FOR INTERCOMPANY AGREEMENTS & DISCLOSURES

Pursuant to the Freedom of Information Act, 5 U.S.C. § 552, and 17 CFR Part 200, Subpart D, the undersigned hereby requests copies of all non-exempt correspondence, staff comment letters, and formal disclosures submitted to the Division of Corporation Finance concerning:
1. Any cross-entity intellectual property, data scraping, or training pipeline licensing agreements executed between X Corp (CIK 0001495048) and xAI Holdings Co. (CIK 0001985959).
2. All Form D exempt offering verification records for xAI Series B financing.

Fee Waiver Requested: This request is made for non-commercial investigative research in the urgent public interest.

Respectfully submitted,
GhostGate Forensic Compliance Unit`
  },
  {
    id: 'FOIA-2026-002',
    trackingNumber: 'FOIA-NASA-2026-MSFC-041',
    agency: 'National Aeronautics and Space Administration (NASA)',
    targetEntity: 'Space Exploration Technologies Corp.',
    requestSubject: 'Artemis HLS Contract 80MSFC20C0034 Cryogenic Propellant Transfer Safety Review Memoranda',
    expeditedStatus: false,
    filingDate: '2026-07-22',
    status: 'DISPATCHED',
    estimatedFulfillment: '2026-10-30',
    webhookSyncUrl: 'https://api.ghostgate.internal/foia/webhook/nasa-msfc-041',
    s3PayloadRef: 's3://ghostgate-audit-vault/foia/NASA-MSFC-041-manifest.json',
    gapsTargeted: 'Technical milestone sign-off waivers on orbital fuel boil-off and docking safety protocols.',
    generatedLetterText: `FREEDOM OF INFORMATION ACT REQUEST / 5 U.S.C. § 552
TO: NASA Marshall Space Flight Center FOIA Requester Service Center
DATE: July 22, 2026
SUBJECT: HLS MILESTONE TECHNICAL VERIFICATION MEMORANDA (CONTRACT 80MSFC20C0034)

Requesting complete unredacted or minimally redacted records of:
1. Technical Milestone Review Board minutes for HLS Option A propellant management milestone PDR-3.
2. Safety waiver requests and concurrence sheets submitted by prime contractor SpaceX from Jan 2023 to present.

GhostGate Forensic Compliance Unit`
  },
  {
    id: 'FOIA-2026-003',
    trackingNumber: 'FOIA-TREAS-2026-DOGE-007',
    agency: 'Department of the Treasury (Bureau of the Fiscal Service)',
    targetEntity: 'Department of Government Efficiency (DOGE) / Executive Office',
    requestSubject: 'Treasury Payment Automation Manager (PAM) Direct Access Authorizations & Detailee Memoranda',
    expeditedStatus: true,
    filingDate: '2026-09-02',
    status: 'APPEAL_PENDING',
    estimatedFulfillment: '2026-12-05',
    webhookSyncUrl: 'https://api.ghostgate.internal/foia/webhook/treasury-pam-007',
    s3PayloadRef: 's3://ghostgate-audit-vault/foia/TREAS-DOGE-007-manifest.json',
    gapsTargeted: 'Legal authority documentation for third-party advisory staff access to federal disbursement queues.',
    generatedLetterText: `FREEDOM OF INFORMATION ACT EXPEDITED REQUEST / 5 U.S.C. § 552
TO: Department of the Treasury FOIA Officer, Washington, DC
DATE: September 2, 2026
SUBJECT: SYSTEM AUTHORIZATION ACCESS REQUESTS (SAAR) FOR TREASURY PAM DISBURSEMENT SYSTEMS

Requesting:
1. System Authorization Access Requests (DD Form 2875 / Treasury equivalent) executed for non-career advisory personnel associated with DOGE.
2. Inter-agency detailee agreements (MOU/MOA) and 18 U.S.C. 208 conflict clearance certifications.

GhostGate Forensic Compliance Unit`
  }
];
