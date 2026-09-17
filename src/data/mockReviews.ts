import { Review, AuthorProfile } from '../types';
import { AUTHOR_SOCIAL_AND_BIO_DATA, getAuthorSocialAndBioData } from './authorSocialData';

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  'book-sovereign-creator': [
    {
      id: 'rev-1',
      bookId: 'book-sovereign-creator',
      author: 'Julian Vance, Media Director',
      rating: 5,
      title: 'The Raw Handwritten Manuscript and Musical Album are pure genius!',
      date: 'March 2, 2026',
      verifiedPurchase: true,
      content: 'Reading Dr. Marcus Sterling\'s handwritten notebooks with fountain pen crossed-out paragraphs gave me chills. It is such an intimate, rare glimpse into the creation of a seminal masterpiece. And listening to the companion ambient score while reading creates an unparalleled deep work state. Essential purchase in the Hardcover + Pendrive bundle!',
      formatPurchased: 'manuscript',
      helpfulCount: 42
    },
    {
      id: 'rev-2',
      bookId: 'book-sovereign-creator',
      author: 'Evelyn St. Claire',
      rating: 5,
      title: 'The Clothbound Hardcover is breathtaking quality',
      date: 'February 24, 2026',
      verifiedPurchase: true,
      content: 'I ordered the Hardcover edition and received the physical book in 3 days. The foil stamping on the spine and 80lb archival paper feels like a 19th-century private press publication. Also love that my account auto-synced the digital copy to my Knowledge Centa cloud library.',
      formatPurchased: 'hardcover',
      helpfulCount: 28
    },
    {
      id: 'rev-3',
      bookId: 'book-sovereign-creator',
      author: 'Devon K. Reed',
      rating: 5,
      title: 'The USB Pendrive Collector Vault is worth every single penny',
      date: 'February 19, 2026',
      verifiedPurchase: true,
      content: 'Having the 64GB dual USB-C metal drive with all 4K video masterclasses, 24-bit FLAC audio album, raw draft scans, and companion spreadsheets offline gives me permanent peace of mind. No DRM, sovereign digital custody.',
      formatPurchased: 'pendrive_sd',
      helpfulCount: 19
    },
    {
      id: 'rev-4',
      bookId: 'book-sovereign-creator',
      author: 'Claire Morales',
      rating: 4,
      title: 'Incredible audiobook narration and stellar companion notes',
      date: 'January 28, 2026',
      verifiedPurchase: true,
      content: 'Jameson Clarke is an exceptional narrator. He captures Marcus\'s urgency and strategic clarity with perfection. The only reason it\'s 4 stars instead of 5 is that I wish the musical score was mixed slightly louder behind the chapter intros!',
      formatPurchased: 'audiobook',
      helpfulCount: 11
    }
  ],
  'book-quantum-mindset': [
    {
      id: 'rev-qm-1',
      bookId: 'book-quantum-mindset',
      author: 'Dr. Arthur Pendelton',
      rating: 5,
      title: 'A quantum leap in cognitive performance frameworks',
      date: 'March 6, 2026',
      verifiedPurchase: true,
      content: 'Elena Vance has distilled two decades of coaching aerospace founders into a pragmatic, razor-sharp manual. The raw handwritten notebook diagrams for mental models 4 and 7 alone are worth 10x the price of admission.',
      formatPurchased: 'manuscript',
      helpfulCount: 35
    },
    {
      id: 'rev-qm-2',
      bookId: 'book-quantum-mindset',
      author: 'Sophia Chen',
      rating: 5,
      title: 'Paper Cover edition is my daily travel companion',
      date: 'February 12, 2026',
      verifiedPurchase: true,
      content: 'Beautiful velvety matte cover, perfectly bound trade paperback. I have dog-eared over 40 pages already.Elena\'s perspective on decision latency will re-wire how you run your company.',
      formatPurchased: 'papercover',
      helpfulCount: 14
    }
  ],
  'book-hyperfocus-protocol': [
    {
      id: 'rev-hp-1',
      bookId: 'book-hyperfocus-protocol',
      author: 'Liam O\'Connor',
      rating: 5,
      title: 'The companion musical album puts you in an instant flow state',
      date: 'March 1, 2026',
      verifiedPurchase: true,
      content: 'The binaural and ambient tracks composed specifically for this book are remarkable. I play track 2 on repeat during 90-minute deep work sprints. Truly multi-sensory publishing.',
      formatPurchased: 'musical_album',
      helpfulCount: 22
    }
  ]
};

export const INITIAL_AUTHOR_PROFILES: Record<string, any> = {
  'Dr. Marcus Sterling': {
    id: 'author-marcus-sterling',
    penName: 'Dr. Marcus Sterling',
    realName: 'Marcus Sterling Ph.D.',
    bio: 'Tech philosopher, research director, and founder of the Decentralized Creator Foundry. Pioneer of multi-dimensional sovereign publishing across handwritten manuscript archives, acoustic albums, 4K video books, and archival print editions.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    payoutEmail: 'johnnyblueagency@gmail.com',
    royaltyRate: 0.85,
    verified: true,
    memberSince: 'October 2024',
    location: 'Zurich, Switzerland & San Francisco, CA',
    websiteUrl: 'https://marcussterling.creator.press',
    twitterHandle: '@MarcusSterling',
    socialHandles: AUTHOR_SOCIAL_AND_BIO_DATA['Dr. Marcus Sterling'].socialHandles,
    bioData: AUTHOR_SOCIAL_AND_BIO_DATA['Dr. Marcus Sterling'].bioData,
    totalBooksPublished: 4,
    totalReaders: 48920,
    totalEarningsEstimate: 124850.00,
    followersCount: 1420,
    googleDriveConnected: true,
    googleDriveAccount: 'johnnyblueagency@gmail.com',
    googleDriveFolderId: 'kc_vault_marcus_sterling',
    googleDriveFolderName: 'Knowledge Centa Books & Vault / Dr. Marcus Sterling',
    uploadedHandwrittenManuscripts: [
      {
        id: 'ms-sovereign-raw-v1',
        title: 'The Sovereign Creator - Original Moleskine Notebook #1 (Ink & Draft Notes)',
        driveFileId: '1DrMarcusNotebookScan2026v1',
        driveViewLink: 'https://drive.google.com/file/d/1DrMarcusNotebookScan2026v1/view?usp=sharing',
        pageCount: 142,
        uploadedAt: '2026-01-14T11:20:00Z'
      },
      {
        id: 'ms-sovereign-raw-v2',
        title: 'The Venice Copyright Guild & Gutenberg Chapters - Unedited Fountain Pen Scans',
        driveFileId: '1VeniceGuildDraftScans2026',
        driveViewLink: 'https://drive.google.com/file/d/1VeniceGuildDraftScans2026/view?usp=sharing',
        pageCount: 88,
        uploadedAt: '2026-01-20T16:45:00Z'
      }
    ],
    uploadedMusicalAlbums: [
      {
        id: 'album-sovereign-soundtrack',
        albumTitle: 'The Sovereign Creator: Original Book Soundtrack & Ambient Score',
        driveFileId: '1SoundtrackSovereignMasterFLAC',
        driveViewLink: 'https://drive.google.com/file/d/1SoundtrackSovereignMasterFLAC/view?usp=sharing',
        trackCount: 8,
        uploadedAt: '2026-01-28T09:15:00Z'
      }
    ]
  },
  'Elena Vance': {
    id: 'author-elena-vance',
    penName: 'Elena Vance',
    realName: 'Elena Vance',
    bio: 'Executive cognitive performance strategist who coaches elite aerospace founders, hedge fund principals, and international grandmasters. Dedicated to multi-format learning architectures.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    payoutEmail: 'elena.vance@quantumleadership.io',
    royaltyRate: 0.85,
    verified: true,
    memberSince: 'March 2025',
    location: 'London, UK & Boston, MA',
    websiteUrl: 'https://elenavance.io',
    twitterHandle: '@ElenaVanceMind',
    socialHandles: AUTHOR_SOCIAL_AND_BIO_DATA['Elena Vance'].socialHandles,
    bioData: AUTHOR_SOCIAL_AND_BIO_DATA['Elena Vance'].bioData,
    totalBooksPublished: 2,
    totalReaders: 31200,
    totalEarningsEstimate: 89400.00,
    followersCount: 890,
    googleDriveConnected: true,
    googleDriveAccount: 'johnnyblueagency@gmail.com',
    googleDriveFolderId: 'kc_vault_elena_vance',
    googleDriveFolderName: 'Knowledge Centa Books & Vault / Elena Vance',
    uploadedHandwrittenManuscripts: [
      {
        id: 'ms-quantum-notebook-v1',
        title: 'Cognitive Loop Diagrams & Hand-Drawn Decision Matrix Scans',
        driveFileId: '1ElenaVanceQuantumLoopScans',
        driveViewLink: 'https://drive.google.com/file/d/1ElenaVanceQuantumLoopScans/view?usp=sharing',
        pageCount: 96,
        uploadedAt: '2025-11-10T08:30:00Z'
      }
    ],
    uploadedMusicalAlbums: [
      {
        id: 'album-quantum-frequencies',
        albumTitle: 'Deep Alpha Frequencies: Companion Audio for Quantum Mindset',
        driveFileId: '1AlphaFrequenciesMasterElena',
        driveViewLink: 'https://drive.google.com/file/d/1AlphaFrequenciesMasterElena/view?usp=sharing',
        trackCount: 6,
        uploadedAt: '2025-11-18T14:10:00Z'
      }
    ]
  }
};
