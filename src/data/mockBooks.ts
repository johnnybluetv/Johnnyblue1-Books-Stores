import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-sovereign-creator',
    slug: 'the-sovereign-creator',
    title: 'The Sovereign Creator: Architecting Digital Wealth, AI Leverage, and Decentralized Publishing',
    subtitle: 'The Definitive Blueprint for Writers, Thinkers, and Media Architects in the Next Economy',
    author: 'Dr. Marcus Sterling',
    authorBio: 'Dr. Marcus Sterling is a former Silicon Valley research director, tech philosopher, and founder of the Decentralized Creator Foundry. His essays have reached over 3.2 million readers worldwide.',
    authorId: 'author-marcus-sterling',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    category: 'Business & Technology',
    rating: 4.9,
    reviewCount: 1428,
    publishedDate: 'January 2026',
    publisher: 'Knowledge Centa Press & Johnnyblue1 Media',
    isbn: '978-0-9876543-2-1',
    pages: 384,
    language: 'English',
    bestSellerCategory: '#1 Best Seller in Digital Media & AI Architecture',
    editorsPick: true,
    draft2DigitalUrl: 'https://www.draft2digital.com/book/the-sovereign-creator',
    authorWhatsapp: '+233555414967',
    description: `The rules of content ownership and publishing have permanently shifted. Traditional publishing models take 85% of your royalties and lock your intellectual property into rigid legacy formats.

In "The Sovereign Creator", Dr. Marcus Sterling reveals the exact operational framework utilized by the world's most profitable independent creators to tokenize their backlists, orchestrate multi-modal publishing workflows (eBooks, audio narration, cinematic video books, and raw pre-release manuscripts), and bypass intermediaries.

Featuring real-world case studies, architectural schematics for distributed media delivery, and actionable strategies for building sovereign digital wealth.`,
    chapterOnePreview: {
      title: 'Chapter 1: The Myth of the Subsidized Mind',
      subheading: 'Why legacy platforms rented your attention and how to reclaim your sovereign copyright.',
      content: [
        'For three hundred years, the printed page was an iron cage wrapped in the guise of prestige. When Johannes Gutenberg assembled movable type in Mainz, he gave mankind an amplifier—yet within five decades, the machinery of distribution had already consolidated into cartels of paper merchants, royal printing licenses, and guild masters.',
        'Fast forward to our contemporary digital landscape: we were promised democratization. Instead, we were given feeds. We traded royal printing patents for algorithmic throttles, platform rent extraction, and fractional ad-revenue pennies.',
        'True intellectual sovereignty begins with the realization that your ideas are not mere "content"—they are compound intellectual assets. When packaged across multiple sensory dimensions—the precision of text, the intimacy of the spoken voice, the immersion of cinematic video, and the unfiltered rawness of author drafts—an idea ceases to be perishable media and becomes an intellectual fortress.',
        'Over the next twelve chapters, we will deconstruct the eight-format architecture: how to build, secure, and deliver your knowledge directly to your community without surrendering sovereign control.'
      ]
    },
    audioSample: {
      title: 'The Sovereign Creator (Audio Edition)',
      narrator: 'Jameson Clarke (Audie Award Winner)',
      durationSeconds: 27840, // 7h 44m
      sampleDurationSeconds: 312,
      audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
      chapterList: [
        { name: 'Prologue: The Gutenberg Inversion', duration: '18:42' },
        { name: 'Chapter 1: The Myth of the Subsidized Mind', duration: '44:15' },
        { name: 'Chapter 2: The Multi-Format Matrix (Audio, Video, Text)', duration: '52:08' },
        { name: 'Chapter 3: Sovereign Storage & Cryptographic Media Rights', duration: '49:30' },
        { name: 'Chapter 4: Algorithmic Arbitrage for Authors', duration: '41:10' }
      ]
    },
    videoSample: {
      title: 'The Sovereign Creator: Masterclass Video Book Edition',
      resolution: '4K Ultra-HD (1080p Stream) + Companion Worksheets',
      durationSeconds: 14400, // 4 hours
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      aspectRatio: '16:9',
      companionNotesPreview: 'Includes synchronized interactive diagrams, downloadable Notion workspace templates, and annotated architecture maps.'
    },
    manuscriptSample: {
      version: 'Author Raw Handwritten Notebook (Original Ink Draft)',
      notebookType: 'Custom Moleskine Grid Notebook #4 (Original Fountain Pen & Ink Draft)',
      draftStatus: 'Authentic Uncut Handwritten Scan',
      lastUpdated: 'February 18, 2026',
      authorMarginNotes: [
        { paragraphIndex: 0, note: 'Marcus note: Expand on the Venice copyright guild of 1502 in the final print proof.' },
        { paragraphIndex: 2, note: 'Marcus note: Highlight this sentence in the audio companion workbook.' }
      ],
      handwrittenNotebook: {
        title: 'Original Handwritten Draft Notebook (Volume 1)',
        medium: 'Pelikan Souverän M800 Fountain Pen (Fine Nib) with Edelstein Onyx Ink on 120gsm Grid Moleskine Paper',
        totalPages: 142,
        scannedPages: [
          {
            pageNumber: 1,
            imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Oct 14, 2025 - Hotel Schweizerhof, Zurich.\nThe central thesis must not waver: publishing is not distribution of words; it is the establishment of an immutable sovereign estate. If an author does not own the database of their readership and the raw sensory dimensions of their thought, they are merely a sharecropper in another man’s algorithmic valley.',
            authorAnnotation: 'Core principle jotted down at 2:00 AM after keynote.'
          },
          {
            pageNumber: 2,
            imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Oct 18, 2025.\n[Arrow pointing to schematic: The 8-Format Octagon]\n1. eBook (precision)\n2. Audiobook (voice cadence)\n3. Video Book (visual synthesis)\n4. Raw Manuscript (unfiltered intimacy of ink)\n5. Hardcover (tactile archival heirloom)\n6. Paper Cover (everyday working volume)\n7. Pendrive/Micro-SD Vault (air-gapped permanent storage)\n8. Musical Album (emotional state primer)',
            authorAnnotation: 'First hand-drawn sketch of the 8 publishing dimensions.'
          },
          {
            pageNumber: 3,
            imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Nov 02, 2025 - Frankfurt Book Fair Notes.\nSpoke with European publishing directors. They admit privately that 82% of mid-tier authors lose money under legacy contracts. The future belongs to creators with direct, encrypted pipelines.',
            authorAnnotation: 'Cross-checked with financial audit records.'
          }
        ]
      }
    },
    musicalAlbumSample: {
      albumTitle: 'The Sovereign Creator: Original Book Soundtrack & Ambient Score',
      composer: 'Dr. Marcus Sterling & Berlin Ambient Collective',
      totalDuration: '38 min 42 sec',
      genre: 'Cinematic Ambient / Neo-Classical Piano / Focus Frequencies',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
      tracks: [
        {
          id: 'sc-track-1',
          trackNumber: 1,
          title: 'Overture: The Mainz Inversion',
          duration: '4:15',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Acoustic piano opening with layered cello drone, designed to induce deep cognitive focus.'
        },
        {
          id: 'sc-track-2',
          trackNumber: 2,
          title: 'Sovereign Frequencies (Alpha Waves)',
          duration: '5:42',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Binaural 10Hz alpha frequency bed accompanied by subtle modular analog synthesizer pads.'
        },
        {
          id: 'sc-track-3',
          trackNumber: 3,
          title: 'Midnight in the Scriptorium',
          duration: '6:18',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Minimalist upright piano recorded with close-mic hammer resonance and rain ambiance.'
        },
        {
          id: 'sc-track-4',
          trackNumber: 4,
          title: 'The Decentralized Dawn (Finale)',
          duration: '5:24',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Soaring crescendo of orchestral strings symbolizing creator independence and creative triumph.'
        }
      ]
    },
    hardcoverDetails: {
      binding: 'Smyth-Sewn Clothbound Hardcover with Gold Foil Stamping',
      foilStamping: '24k Matte Gold Foil on Deep Navy European Linen Spine',
      ribbonColor: 'Crimson Silk Ribbon Bookmark',
      weight: '1.8 lbs (816g)',
      shippingEstimate: 'Ships in 2-3 business days (Priority tracked delivery)'
    },
    papercoverDetails: {
      paperStock: '60lb Acid-Free Natural Cream Archival Book Paper',
      finish: 'Velvet Matte Soft-Touch Laminated Cover with Embossed Title',
      dimensions: '6.0" x 9.0" Standard Royal Trade Paperback',
      shippingEstimate: 'Ships in 2-4 business days (Global delivery)'
    },
    pendriveSdDetails: {
      storageCapacity: '64GB Dual USB-C & USB-A 3.2 Metal Pendrive + 64GB Micro-SD Card with Adapter',
      connector: 'Heavy-Duty Zinc Alloy Dual Head (USB-C & USB 3.2 Type-A)',
      includesCardReader: true,
      preloadedContents: [
        'Complete 4K Ultra-HD Video Book Masterclass (.mp4 60fps)',
        '24-Bit / 96kHz Lossless Studio FLAC Audiobook + 320kbps MP3s',
        'DRM-Free EPUB3 & High-Res PDF eBooks',
        '600 DPI Full-Color Scans of the Original Handwritten Notebooks & Sketches',
        'Original Book Musical Soundtrack Album (Lossless WAV & 320kbps MP3)',
        'Bonus Downloadable Notion Templates, Strategic Financial Models & Worksheets',
        'Cryptographically Signed Author Certificate of Ownership (.sig)'
      ]
    },
    silkCottonDetails: {
      material: '100% Pure Mulberry Silk & Combed Egyptian Cotton Weave',
      binding: 'Master Guild Smyth-Sewn Lay-Flat Binding with Silk Fabric Spine',
      artisanOrigin: 'Florence Atelier Heritage Bookbindery (Master Guild Hand-Crafted)',
      edgeFinishing: 'Hand-Deckled Edges with 24k Gold Foil Leaf Stamping',
      slipcase: 'Cloth-Lined Archival Solander Box with Debossed Title Plate',
      limitedEditionUnits: 250,
      shippingEstimate: 'Handcrafted to order; ships insured in 4-6 business days'
    },
    digitalDeviceDetails: {
      deviceName: 'The Sovereign Slate 7.8" (Dedicated Masterwork Reader)',
      screenTech: '7.8-inch 300 PPI E-Ink Carta 1200 Glare-Free Ambient Display with Warm Frontlight',
      enclosureMaterial: 'CNC Machined Anodized Space Gray Aerospace Aluminum with Solid Brass Page-Turn Buttons',
      storageCapacity: '64GB Ultra-Fast Solid-State Offline Vault',
      batteryLife: '8-10 Weeks Standby, 45 Hours Continuous Active Reading',
      audioJack: 'Dual 3.5mm Audiophile Headphone Jack + Bluetooth 5.3 LDAC (32-Bit / 384kHz DAC)',
      firmwareOS: 'Single-Book Sovereign OS (Zero Notifications, Zero Distractions, Boots Directly into Book)',
      bundledDimensionsCarried: [
        '1. eBook: Full responsive EPUB3 with custom serif typography',
        '2. Audiobook: 24-bit / 96kHz studio uncompressed narration with chapter bookmarks',
        '3. 4K Video Book: Masterclass lecture video series with companion notes',
        '4. Raw Handwritten Manuscript: 600 DPI scans with deep pinch-to-zoom author ink notes',
        '5. Hardcover Print Facsimile: Exact typographic layout of collector clothbound edition',
        '6. Paper Cover Layout: High-contrast everyday reading mode',
        '7. Hardware SD Vault: Offline cryptographic media archive & backup image',
        '8. Musical Album: Master FLAC soundtrack & ambient cognitive focus frequencies',
        '9. Silk & Cotton Archive: High-magnification weave inspection & artisan bindery documentation'
      ],
      includedAccessories: [
        'Full-Grain Tuscan Leather Magnetic Folio Sleep Cover',
        'Braided USB-C Fast-Charging Cable (2m)',
        'Brass Laser-Engraved Sovereign Author Bookmark Key',
        'Hand-Signed & Numbered Certificate of Hardware Provenance'
      ],
      shippingEstimate: 'White-Glove Insured Priority Courier Delivery (2-3 Business Days)'
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'eBook (EPUB / PDF)',
        badge: 'Instant Download',
        price: 14.99,
        originalPrice: 19.99,
        fileFormat: 'DRM-Free EPUB & High-Res PDF',
        fileSize: '14.2 MB',
        sampleLength: 'Chapter 1 & 2 (38 pages)',
        available: true,
        features: ['Instant sync to Knowledge Centa Reader', 'EPUB3 & Print-Quality PDF included', 'Highlighting, search & dark mode support']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Audiobook (MP3 / M4B)',
        badge: 'Unabridged Studio',
        price: 24.95,
        originalPrice: 29.99,
        fileFormat: 'MP3 (320kbps) & Chaptered M4B',
        fileSize: '482 MB',
        duration: '7 hr 44 min',
        sampleLength: '5 min 12 sec Audio Sample',
        available: true,
        features: ['Narrated by Jameson Clarke', 'Lossless 320kbps studio master', 'Variable speed playback & chapter bookmarks']
      },
      videobook: {
        type: 'videobook',
        name: 'Video Book (4K MP4 / HLS)',
        badge: 'Cinematic Edition',
        price: 34.99,
        originalPrice: 49.99,
        fileFormat: '4K Ultra-HD MP4 & Adaptive HLS',
        fileSize: '3.8 GB',
        duration: '4 hr 02 min',
        sampleLength: 'Trailer & Scene 1 (6 min)',
        available: true,
        features: ['Filmed in studio with custom motion graphics', 'Synchronized transcripts & chapter markers', 'Includes digital companion blueprint bundle']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Raw Handwritten Manuscript',
        badge: 'Authentic Notebook Scans',
        price: 49.00,
        originalPrice: 75.00,
        fileFormat: '600 DPI Scanned Pages & Raw Ink PDF',
        fileSize: '68.4 MB',
        sampleLength: 'Handwritten Pages 1-3 & Margin Notes',
        available: true,
        features: ['Direct scans of Dr. Sterling original Moleskine notebook', 'Unedited fountain pen scribbles, sketches & struck paragraphs', 'Side-by-side author transcription mode']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Hardcover (Clothbound Print)',
        badge: 'Collector Foil Edition',
        price: 38.00,
        originalPrice: 48.00,
        fileFormat: 'Clothbound Hardcover Book (Physical)',
        fileSize: '384 Printed Pages',
        sampleLength: 'Clothbound Inspection Photos',
        available: true,
        features: ['Smyth-sewn binding opens perfectly flat', '24k gold foil stamping on European navy linen', 'Free instant digital eBook sync included']
      },
      papercover: {
        type: 'papercover',
        name: 'Paper Cover (Paperback)',
        badge: 'Trade Paperback',
        price: 22.00,
        originalPrice: 28.00,
        fileFormat: 'Trade Paperback 6x9 Print (Physical)',
        fileSize: '384 Printed Pages',
        sampleLength: 'Table of Contents & Ch 1',
        available: true,
        features: ['Velvet soft-touch matte finish with embossed accents', '60lb natural cream archival acid-free paper', 'Free digital eBook sync included']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Pendrive & Memory Card / SD-Card',
        badge: 'Collector USB-C / Micro-SD Vault',
        price: 79.00,
        originalPrice: 110.00,
        fileFormat: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
        fileSize: '64 GB Storage Vault',
        sampleLength: 'Vault Contents Specsheet',
        available: true,
        features: ['Heavy-duty zinc alloy dual USB-C / USB-A 3.2 metal key', 'Includes 64GB Micro-SD card & USB adapter', 'Preloaded with all 4K video, lossless audio, raw scans & FLAC soundtrack']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Musical Album (Book Soundtrack)',
        badge: 'Original Ambient Score',
        price: 18.00,
        originalPrice: 25.00,
        fileFormat: '24-Bit FLAC & 320kbps MP3 Album',
        fileSize: '340 MB',
        duration: '38 min 42 sec',
        sampleLength: 'Overture Sample (4 min)',
        available: true,
        features: ['Bespoke 8-track score composed to accompany reading', 'Binaural alpha wave focus frequencies', 'Stream instantly or download lossless master files']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Silk / Cotton Material Edition',
        badge: 'Artisanal Woven Cloth',
        price: 95.00,
        originalPrice: 135.00,
        fileFormat: 'Hand-Bound Mulberry Silk / Combed Cotton (Physical)',
        fileSize: '384 Handcrafted Pages',
        sampleLength: 'Fabric Texture & Deckle Edge Inspection',
        available: true,
        features: [
          'Hand-bound in 100% natural Mulberry silk spine & combed Egyptian cotton cloth',
          'Smyth-sewn lay-flat binding with 24k gold foil leaf edge gilding',
          'Includes archival cloth-lined Solander presentation box & numbered certificate'
        ]
      },
      digital_device: {
        type: 'digital_device',
        name: 'Digital Device (Dedicated E-Reader)',
        badge: 'Dedicated Tablet (All 9 Formats Inside)',
        price: 299.00,
        originalPrice: 399.00,
        fileFormat: '7.8" E-Ink Carta 1200 Hardware Tablet (Preloaded)',
        fileSize: '64 GB Dedicated Solid-State Vault',
        sampleLength: 'Interactive Hardware & OS Preview',
        available: true,
        features: [
          'Custom hardware device engineered solely for this single masterwork',
          'Zero-distraction Sovereign OS (no notifications, ads, or browser bloat)',
          'Pre-loaded offline with all 9 other dimensions (eBook, Audio, Video, Manuscript, Hardcover, Paperback, SD, Music, Silk/Cotton)',
          '7.8" 300 PPI glare-free E-Ink Carta 1200 screen with physical brass buttons',
          'Dual 3.5mm hi-res headphone jack, Bluetooth 5.3 LDAC & 8-week battery'
        ]
      }
    },
    tags: ['Decentralized Media', 'AI Leverage', 'Self-Publishing', 'Creator Economy', 'Digital Assets']
  },
  {
    id: 'book-quantum-mindset',
    slug: 'the-quantum-mindset',
    title: 'The Quantum Mindset: Breaking the Gravitational Pull of Mediocrity',
    subtitle: 'High-Performance Cognitive Operating Systems for High-Stakes Decision Makers',
    author: 'Elena Vance',
    authorBio: 'Elena Vance is an executive performance strategist who coaches elite aerospace founders, hedge fund principals, and international grandmasters.',
    authorId: 'author-elena-vance',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
    category: 'Psychology & Leadership',
    rating: 4.8,
    reviewCount: 986,
    publishedDate: 'November 2025',
    publisher: 'Knowledge Centa Press',
    isbn: '978-0-9123456-7-8',
    pages: 312,
    language: 'English',
    bestSellerCategory: '#1 in Cognitive Performance',
    editorsPick: true,
    draft2DigitalUrl: 'https://www.draft2digital.com/book/the-quantum-mindset',
    authorWhatsapp: '+233555414967',
    description: `Why do extraordinarily capable leaders stall right at the threshold of immense scale? The answer lies not in effort or discipline, but in the subconscious gravitational wells of legacy thinking.

In "The Quantum Mindset", Elena Vance breaks down the neuroscience of non-linear breakthroughs, probability engineering, and rapid mental reframing.`,
    chapterOnePreview: {
      title: 'Chapter 1: The Observer Effect in Modern Strategy',
      subheading: 'How your unspoken assumptions collapse strategic possibilities.',
      content: [
        'In quantum physics, the act of measurement actively alters the state of the wave function. What was once an infinite field of superposed probability collapses the microsecond a detector registers a photon.',
        'In organizational strategy and personal execution, human attention behaves in precisely the same manner. The metric you prioritize immediately warps the reality of the people tracking it.',
        'When you measure hours, you manufacture performative fatigue. When you measure output without velocity, you subsidize bureaucratic inertia. To escape mediocrity, one must learn to operate in superposition.'
      ]
    },
    audioSample: {
      title: 'The Quantum Mindset (Audiobook)',
      narrator: 'Elena Vance (Author Edition)',
      durationSeconds: 21900,
      sampleDurationSeconds: 280,
      audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
      chapterList: [
        { name: 'Introduction: The Gravity Well', duration: '12:10' },
        { name: 'Chapter 1: The Observer Effect in Strategy', duration: '38:40' },
        { name: 'Chapter 2: Probability Mapping & Asymmetric Bets', duration: '47:20' }
      ]
    },
    videoSample: {
      title: 'The Quantum Mindset: Visual Lecture Series',
      resolution: '1080p HD Studio Master',
      durationSeconds: 10800,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      aspectRatio: '16:9',
      companionNotesPreview: 'Full mind maps, cognitive diagnostic tests, and audio summary flashcards.'
    },
    manuscriptSample: {
      version: 'Author Raw Handwritten Notebook (Original Scans)',
      notebookType: 'Leuchtturm1917 Bullet Journal with Archival Ink & Hand-Drawn Mind Maps',
      draftStatus: 'Authentic Uncut Handwritten Scan',
      lastUpdated: 'December 2025',
      authorMarginNotes: [
        { paragraphIndex: 0, note: 'Elena note: Include the MIT cognitive experiment dataset citations here.' }
      ],
      handwrittenNotebook: {
        title: 'Quantum Cognitive Field Notes (Author Handwritten Original)',
        medium: 'Lamy 2000 Fountain Pen with Iroshizuku Kon-peki Ink on 100gsm Dot-Grid Paper',
        totalPages: 96,
        scannedPages: [
          {
            pageNumber: 1,
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Nov 12, 2025.\nThe mind does not fear failure; it fears the dissolution of certainty. When leaders cling to predictable trajectories, they forfeit non-linear returns. To enter quantum thinking, one must embrace strategic ambiguity.',
            authorAnnotation: 'Key framework note written during executive coaching retreat.'
          },
          {
            pageNumber: 2,
            imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Nov 20, 2025.\n[Matrix Diagram: Probability vs. Commitment]\nHigh probability + Low commitment = Stagnation\nAsymmetric risk + Total presence = The Quantum Leap',
            authorAnnotation: 'Diagram used in the masterclass lecture.'
          }
        ]
      }
    },
    musicalAlbumSample: {
      albumTitle: 'Deep Alpha Frequencies: Companion Audio for Quantum Mindset',
      composer: 'Elena Vance & Neuro-Acoustic Labs',
      totalDuration: '44 min 10 sec',
      genre: 'Binaural Alpha Waves / Minimalist Electronic Drone',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      tracks: [
        {
          id: 'qm-track-1',
          trackNumber: 1,
          title: 'Entering Superposition (10Hz Alpha)',
          duration: '6:12',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Acoustic wave bed calibrated to 10Hz to soothe stress and activate strategic thinking.'
        },
        {
          id: 'qm-track-2',
          trackNumber: 2,
          title: 'Collapse of the Waveform',
          duration: '5:45',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Gentle piano motifs layered over warm sub-bass frequencies.'
        }
      ]
    },
    hardcoverDetails: {
      binding: 'Hardcover Linen with Embossed Holographic Silver Foil',
      foilStamping: 'Silver Foil Stamped on Slate Gray Cloth',
      ribbonColor: 'Ice Blue Silk Ribbon',
      weight: '1.5 lbs',
      shippingEstimate: 'Ships in 2-3 business days'
    },
    papercoverDetails: {
      paperStock: '60lb Soft White Acid-Free Paper',
      finish: 'Matte Finish with Spot Gloss',
      dimensions: '6.0" x 9.0" Paperback',
      shippingEstimate: 'Ships in 2-4 business days'
    },
    pendriveSdDetails: {
      storageCapacity: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
      connector: 'USB-C / USB 3.2 Dual Head',
      includesCardReader: true,
      preloadedContents: [
        'Full 1080p Visual Masterclass Video Series',
        'Lossless 320kbps MP3 Audiobook',
        'DRM-Free EPUB & PDF eBooks',
        'Full Scanned Author Notebooks & Hand-Drawn Cognitive Models',
        'Deep Alpha Companion Album (WAV + MP3)',
        'Cognitive Diagnostic Excel Models & Checklists'
      ]
    },
    silkCottonDetails: {
      material: 'Egyptian Combed Cotton & Raw Tussar Silk Blend',
      binding: 'Hand-Sewn Flexible Archival Binding with Soft-Spun Cotton Spine',
      artisanOrigin: 'Lyon Heritage Textile Bindery (Artisanal Limited Edition)',
      edgeFinishing: 'Silver Foil Leaf Deckled Page Edges',
      slipcase: 'Custom Charcoal Cotton-Bound Slipcase with Embossed Foil',
      limitedEditionUnits: 300,
      shippingEstimate: 'Ships in 3-5 business days (Insured priority delivery)'
    },
    digitalDeviceDetails: {
      deviceName: 'The Quantum E-Ink Companion Slate (Dedicated Book Device)',
      screenTech: '7.8-inch 300 PPI E-Ink Carta 1200 Glare-Free Ambient Screen',
      enclosureMaterial: 'Milled Aerospace Magnesium-Aluminum Alloy Chassis with Tactile Page-Turn Rockers',
      storageCapacity: '64GB Solid-State Offline Vault',
      batteryLife: '9 Weeks Standby / 42 Hours Active Reading',
      audioJack: 'Dual 3.5mm Hi-Res Audio Port + Bluetooth 5.3 LDAC',
      firmwareOS: 'Distraction-Free Quantum OS (Single-Book Firmware, Instant Boot)',
      bundledDimensionsCarried: [
        '1. eBook: Full reflowable EPUB3 & high-res vector PDF',
        '2. Audiobook: Complete 320kbps studio narration with synchronized bookmarks',
        '3. 4K Video Book: Masterclass video series with executive worksheets',
        '4. Raw Handwritten Manuscript: High-res scans of author Leuchtturm journal',
        '5. Hardcover Print Facsimile: Typographic silver-foil edition layout',
        '6. Paper Cover Layout: High-contrast executive reading copy',
        '7. Hardware SD Vault: Offline master media archive & diagnostic spreadsheets',
        '8. Musical Album: Binaural 10Hz alpha wave focus soundtrack (FLAC & MP3)',
        '9. Silk & Cotton Archive: Microscopic weave photographs & textile provenance'
      ],
      includedAccessories: [
        'Slate Gray Magnetic Leather Smart Cover',
        'Braided USB-C Charging Cable',
        'Silver-Plated Metal Decision Key Bookmark',
        'Serialized Hardware Authenticity Card'
      ],
      shippingEstimate: 'Express Courier 2-3 Day Tracked Shipping'
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'eBook (EPUB / PDF)',
        badge: 'Instant Download',
        price: 12.99,
        originalPrice: 17.99,
        fileFormat: 'EPUB & Reflowable PDF',
        fileSize: '11.8 MB',
        sampleLength: 'Chapter 1 (24 pages)',
        available: true,
        features: ['Immediate delivery to cloud library', 'Optimized for Kindle, iPad, & Web Reader']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Audiobook (MP3 / M4B)',
        badge: 'Author Narrated',
        price: 21.95,
        originalPrice: 26.95,
        fileFormat: 'Lossless MP3 (320kbps)',
        fileSize: '390 MB',
        duration: '6 hr 05 min',
        sampleLength: '4 min 40 sec Sample',
        available: true,
        features: ['Read personally by author Elena Vance', 'Includes audio hypnosis & mental primers']
      },
      videobook: {
        type: 'videobook',
        name: 'Video Book (4K MP4)',
        badge: 'Masterclass Edition',
        price: 29.99,
        originalPrice: 39.99,
        fileFormat: '1080p HD MP4 + HLS Stream',
        fileSize: '2.9 GB',
        duration: '3 hr 15 min',
        sampleLength: 'Module 1 Preview (5 min)',
        available: true,
        features: ['Visual breakdowns with dynamic 3D mental models', 'Downloadable workbook exercises']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Raw Handwritten Manuscript',
        badge: 'Authentic Notebook Scans',
        price: 39.00,
        originalPrice: 60.00,
        fileFormat: 'High-Res Scanned Pages & Author Ink PDF',
        fileSize: '54.2 MB',
        sampleLength: 'Raw Notebook Pages 1-2 & Field Notes',
        available: true,
        features: ['Scans of Elena personal Leuchtturm journal', 'Hand-drawn probability trees & decision matrices', 'Author marginalia on cognitive psychology']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Hardcover (Linen & Silver Foil)',
        badge: 'Executive Hardcover',
        price: 34.00,
        originalPrice: 44.00,
        fileFormat: 'Clothbound Hardcover Book (Physical)',
        fileSize: '312 Printed Pages',
        sampleLength: 'Binding Photos & Chapter 1',
        available: true,
        features: ['Embossed silver holographic foil stamping on slate cloth', 'Ice blue silk ribbon bookmark', 'Free digital edition included']
      },
      papercover: {
        type: 'papercover',
        name: 'Paper Cover (Paperback)',
        badge: 'Trade Paperback',
        price: 19.50,
        originalPrice: 24.50,
        fileFormat: 'Trade Paperback 6x9 (Physical)',
        fileSize: '312 Printed Pages',
        sampleLength: 'Table of Contents',
        available: true,
        features: ['Silky matte soft-touch cover', 'Cream acid-free archival paper', 'Free digital edition sync']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Pendrive & Memory Card / SD-Card',
        badge: 'Collector USB-C / Micro-SD Vault',
        price: 69.00,
        originalPrice: 95.00,
        fileFormat: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
        fileSize: '64 GB Storage Vault',
        sampleLength: 'Full Offline Media Spec',
        available: true,
        features: ['Dual USB-C & USB-A metal drive with keychain ring', 'Includes 64GB Micro-SD card & USB adapter', 'Full video masterclass, lossless audio & raw notebook scans']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Musical Album (Audio Primer)',
        badge: 'Alpha Wave Score',
        price: 15.00,
        originalPrice: 22.00,
        fileFormat: 'Lossless FLAC & 320kbps MP3',
        fileSize: '310 MB',
        duration: '44 min 10 sec',
        sampleLength: 'Alpha Frequencies Preview (4 min)',
        available: true,
        features: ['Calibrated binaural alpha waves for deep focus', 'Neuro-acoustic compositions by Elena Vance', 'Instant stream or offline download']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Silk / Cotton Material Edition',
        badge: 'Artisanal Woven Cloth',
        price: 89.00,
        originalPrice: 125.00,
        fileFormat: 'Egyptian Combed Cotton & Tussar Silk (Physical)',
        fileSize: '312 Handcrafted Pages',
        sampleLength: 'Woven Spine & Silver Foil Inspection',
        available: true,
        features: [
          'Hand-bound in Egyptian combed cotton and raw Tussar silk blend',
          'Smyth-sewn flexible binding with silver foil deckled edges',
          'Includes charcoal cotton-bound slipcase and serialized certificate'
        ]
      },
      digital_device: {
        type: 'digital_device',
        name: 'Digital Device (Dedicated E-Reader)',
        badge: 'Dedicated Tablet (All 9 Formats Inside)',
        price: 289.00,
        originalPrice: 389.00,
        fileFormat: '7.8" E-Ink Carta 1200 Hardware Tablet (Preloaded)',
        fileSize: '64 GB Dedicated Solid-State Vault',
        sampleLength: 'Interactive Hardware & OS Preview',
        available: true,
        features: [
          'Dedicated hardware device built solely for this single cognitive masterwork',
          'Zero-distraction Quantum OS (boots instantly into the book)',
          'Pre-loaded offline with all 9 other dimensions (eBook, Audio, Video, Manuscript, Hardcover, Paperback, SD, Music, Silk/Cotton)',
          '7.8" 300 PPI glare-free ambient screen with physical page rockers',
          'Dual 3.5mm hi-res headphone jack + Bluetooth 5.3 LDAC'
        ]
      }
    },
    tags: ['Mindset', 'Leadership', 'Decision Making', 'Neuroscience']
  },
  {
    id: 'book-neural-blueprint',
    slug: 'the-neural-blueprint',
    title: 'The Neural Blueprint: Designing Autonomous Agents & Cognitive Architectures',
    subtitle: 'From Foundational Transformers to Production Multi-Agent Systems in Enterprise Ecosystems',
    author: 'Dr. Kian Davenport',
    authorBio: 'Dr. Kian Davenport is an AI systems architect and senior research fellow specializing in autonomous agent swarms and neuro-symbolic reasoning.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    category: 'Computer Science & AI',
    rating: 5.0,
    reviewCount: 642,
    publishedDate: 'February 2026',
    publisher: 'Johnnyblue1 Technical Imprints',
    isbn: '978-0-8234567-9-0',
    pages: 460,
    language: 'English',
    bestSellerCategory: '#1 in Artificial Intelligence & Machine Learning',
    editorsPick: true,
    draft2DigitalUrl: 'https://www.draft2digital.com/book/the-neural-blueprint',
    authorWhatsapp: '+233555414967',
    description: `A masterclass in engineering state-of-the-art agentic workflows. "The Neural Blueprint" cuts through marketing fluff and teaches software engineers, cloud architects, and tech executives how to construct resilient, self-healing cognitive systems.`,
    chapterOnePreview: {
      title: 'Chapter 1: The Autonomous Spectrum',
      subheading: 'Why prompt engineering is dead and architectural orchestration is everything.',
      content: [
        'Single-turn completions were the infancy of modern machine intelligence. When software engineers first encountered large language models, their immediate reflex was to treat them as API functions with fuzzy inputs.',
        'This mental model failed catastrophically when pushed into high-stakes enterprise production. Real intelligence requires memory trees, tool execution sandboxes, verification loops, and fallback heuristics.',
        'In this chapter, we lay the bedrock for what we call the Tri-Loop Agent Model: Perception, Deliberation, and Verification.'
      ]
    },
    audioSample: {
      title: 'The Neural Blueprint (Audio Edition)',
      narrator: 'Michael Chen (Tech Audiobook Specialist)',
      durationSeconds: 31500,
      sampleDurationSeconds: 340,
      audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
      chapterList: [
        { name: 'Introduction: Beyond the Chatbox', duration: '15:20' },
        { name: 'Chapter 1: The Autonomous Spectrum', duration: '51:10' },
        { name: 'Chapter 2: Memory Fabrics & Vector Graph Hybrids', duration: '58:45' }
      ]
    },
    videoSample: {
      title: 'The Neural Blueprint: Live Code & Architecture Stream',
      resolution: '4K Ultra-HD Screencast & Studio Talks',
      durationSeconds: 18000,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      aspectRatio: '16:9',
      companionNotesPreview: 'Includes complete GitHub repository code, Docker Compose files, and benchmark scripts.'
    },
    manuscriptSample: {
      version: 'Pre-Print Engineering Notebook Draft',
      notebookType: 'Mathematical Engineering Grid Journal (Original Pencil & Ink Diagrams)',
      draftStatus: 'Authentic Uncut Handwritten Scan',
      lastUpdated: 'January 2026',
      authorMarginNotes: [
        { paragraphIndex: 1, note: 'Kian: Verify latest benchmarks against Gemini 2.0 and Claude 3.7 before final distribution.' }
      ],
      handwrittenNotebook: {
        title: 'Agentic Core Mathematical Notes & Swarm Topology Scans',
        medium: 'Rotring Rapidograph 0.35mm with Waterproof Black Ink on Grid Drafting Paper',
        totalPages: 110,
        scannedPages: [
          {
            pageNumber: 1,
            imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Jan 05, 2026.\nDefinition of Agentic State: S = { Memory, ToolRegistry, VerificationMatrix, FallbackTree }.\nA language model without deterministic verification is non-convergent in production.',
            authorAnnotation: 'Mathematical formulation of the Tri-Loop Agent framework.'
          }
        ]
      }
    },
    musicalAlbumSample: {
      albumTitle: 'Cybernetic Synapse: Algorithmic Ambient Soundscapes',
      composer: 'Dr. Kian Davenport & Neural Synthesis Unit',
      totalDuration: '41 min 00 sec',
      genre: 'Algorithmic Ambient & IDM Modular Synthesis',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      tracks: [
        {
          id: 'nb-track-1',
          trackNumber: 1,
          title: 'Perception Loop (Modular Synthesis)',
          duration: '5:10',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Generative modular synths programmed to cycle at 120bpm for engineering flow states.'
        }
      ]
    },
    hardcoverDetails: {
      binding: 'Technical Clothbound with Emerald Foil Title',
      foilStamping: 'Emerald Metallic Foil on Charcoal Buckram',
      ribbonColor: 'Neon Emerald Ribbon Marker',
      weight: '2.2 lbs',
      shippingEstimate: 'Ships in 2-3 business days'
    },
    papercoverDetails: {
      paperStock: '70lb High-Opaque Technical White Paper',
      finish: 'Matte Lamination with UV Spot Highlights',
      dimensions: '7.0" x 10.0" Technical Manual Format',
      shippingEstimate: 'Ships in 2-4 business days'
    },
    pendriveSdDetails: {
      storageCapacity: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
      connector: 'Dual USB-C & USB-A 3.2 Metal Drive',
      includesCardReader: true,
      preloadedContents: [
        'Complete 4K Live Code Video Screencasts',
        'Full GitHub Repo Git Bundle with all commit histories',
        'Docker Compose & Kubernetes manifests for swarm deployment',
        'Lossless FLAC Audiobook & Code Appendix PDF',
        'High-Resolution Scans of Engineering Notebooks & Mathematical Proofs'
      ]
    },
    silkCottonDetails: {
      material: 'Raw Natural Mulberry Silk & Indigo Heavyweight Cotton Weave',
      binding: 'Reinforced Smyth-Sewn Library Binding with Indigo Silk Spine',
      artisanOrigin: 'Kyoto Textile & Bookbindery Guild (Limited Edition)',
      edgeFinishing: 'Graphite Foil Stamped Page Edges',
      slipcase: 'Brushed Aluminum & Cotton-Lined Hard Case',
      limitedEditionUnits: 200,
      shippingEstimate: 'Ships in 3-5 business days (Insured tracking)'
    },
    digitalDeviceDetails: {
      deviceName: 'Neural Architect E-Ink Terminal (Dedicated Engineering Reader)',
      screenTech: '7.8-inch 300 PPI High-Contrast E-Ink Carta 1200 Display (Syntax Sharpened)',
      enclosureMaterial: 'Matte Black Anodized Aviation Grade Aluminum with Tactile Aluminum Buttons',
      storageCapacity: '64GB Fast NVMe Solid-State Storage',
      batteryLife: '10 Weeks Standby, 50 Hours Active Reading',
      audioJack: 'Dual 3.5mm Headphone Jack + Low-Latency Bluetooth 5.3',
      firmwareOS: 'Neural OS (Dedicated Single-Book Terminal, Instant Terminal Boot)',
      bundledDimensionsCarried: [
        '1. eBook: Syntax-highlighted EPUB & high-resolution vector PDF',
        '2. Audiobook: 320kbps unabridged narration with technical code appendix',
        '3. 4K Video Book: Complete 4K live architecture tour & whiteboard lectures',
        '4. Raw Handwritten Manuscript: 600 DPI scans of Dr. Davenport notebook proofs',
        '5. Hardcover Print Facsimile: Technical Smyth-sewn clothbound layout',
        '6. Paper Cover Layout: High-opacity 7x10 lab manual format',
        '7. Hardware SD Vault: Complete Docker images, GitHub git bundle & manifests',
        '8. Musical Album: Modular synthesizer algorithmic focus score (FLAC & MP3)',
        '9. Silk & Cotton Archive: High-magnification weave microscopy and textile stamps'
      ],
      includedAccessories: [
        'Ballistic Nylon Folio Stand Cover',
        'Braided USB-C Data & Charging Cable',
        'Anodized Metal Code Key Bookmark',
        'Cryptographically Signed Hardware Authenticity Certificate'
      ],
      shippingEstimate: 'Express 2-3 Day Courier Tracked Delivery'
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'eBook (EPUB / PDF)',
        badge: 'Code Syntax Highlighted',
        price: 19.99,
        originalPrice: 29.99,
        fileFormat: 'DRM-Free PDF & EPUB with syntax code blocks',
        fileSize: '28.4 MB',
        sampleLength: 'Chapter 1 + System Diagrams',
        available: true,
        features: ['Full-color architectural diagrams', 'Copyable code snippets in Python & TypeScript']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Audiobook (MP3 / M4B)',
        badge: 'Includes PDF Companion',
        price: 26.95,
        originalPrice: 32.95,
        fileFormat: 'MP3 (320kbps) + Code Appendix PDF',
        fileSize: '510 MB',
        duration: '8 hr 45 min',
        sampleLength: '5 min Audio Preview',
        available: true,
        features: ['Crystal-clear technical narration', 'Comes with 120-page companion code index']
      },
      videobook: {
        type: 'videobook',
        name: 'Video Book (4K Screencast)',
        badge: 'Full Architecture Tour',
        price: 39.99,
        originalPrice: 59.99,
        fileFormat: '4K MP4 + Interactive Timestamps',
        fileSize: '4.6 GB',
        duration: '5 hr 00 min',
        sampleLength: 'Architecture Tour (7 min)',
        available: true,
        features: ['Step-by-step code walkthroughs', 'Interactive architecture viewer access']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Raw Handwritten Manuscript',
        badge: 'Engineering Journal Scans',
        price: 55.00,
        originalPrice: 85.00,
        fileFormat: '600 DPI Scans & Mathematical Source PDF',
        fileSize: '72.1 MB',
        sampleLength: 'Mathematical Formulas & Swarm Topologies',
        available: true,
        features: ['Raw drafting notes & mathematical proofs', 'Early agent topologies and rejected architectures']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Hardcover (Technical Buckram)',
        badge: 'Collector Technical Edition',
        price: 46.00,
        originalPrice: 58.00,
        fileFormat: 'Heavy Buckram Hardcover (Physical)',
        fileSize: '460 Printed Pages',
        sampleLength: 'Spec Sheets & Binding',
        available: true,
        features: ['Heavy charcoal buckram with emerald foil stamping', 'Lies completely flat next to keyboard', 'Free digital code repository access']
      },
      papercover: {
        type: 'papercover',
        name: 'Paper Cover (Technical Manual)',
        badge: '7x10 Manual Format',
        price: 28.00,
        originalPrice: 36.00,
        fileFormat: '7x10 Paperback Manual (Physical)',
        fileSize: '460 Printed Pages',
        sampleLength: 'Chapter 1 & Code Examples',
        available: true,
        features: ['Large 7x10 format allows side-by-side code blocks', 'High-opacity crisp white paper', 'Free digital PDF bundle']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Pendrive & Memory Card / SD-Card',
        badge: 'Collector USB-C / Micro-SD Vault',
        price: 89.00,
        originalPrice: 120.00,
        fileFormat: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
        fileSize: '64 GB Storage Vault',
        sampleLength: 'Complete Offline Code Vault',
        available: true,
        features: ['Preloaded with full Docker images, GitHub git bundle & 4K video lectures', 'Air-gapped offline reference vault', 'Includes 64GB Micro-SD card & USB-C metal drive']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Musical Album (Algorithmic Ambient)',
        badge: 'Modular Focus Score',
        price: 16.00,
        originalPrice: 24.00,
        fileFormat: 'Lossless FLAC & 320kbps MP3',
        fileSize: '325 MB',
        duration: '41 min 00 sec',
        sampleLength: 'Perception Loop Preview (3 min)',
        available: true,
        features: ['Modular synthesizer ambient music tuned for programming', 'Composed directly with algorithmic feedback loops', 'Includes high-res digital album artwork']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Silk / Cotton Material Edition',
        badge: 'Artisanal Woven Cloth',
        price: 99.00,
        originalPrice: 140.00,
        fileFormat: 'Mulberry Silk & Indigo Cotton Weave (Physical)',
        fileSize: '460 Handcrafted Pages',
        sampleLength: 'Indigo Silk Spine & Foil Edge Inspection',
        available: true,
        features: [
          'Hand-bound in raw Mulberry silk & Japanese indigo cotton weave',
          'Smyth-sewn lay-flat binding with graphite foil stamped edges',
          'Includes brushed aluminum presentation case & serialized bookplate'
        ]
      },
      digital_device: {
        type: 'digital_device',
        name: 'Digital Device (Dedicated E-Reader)',
        badge: 'Dedicated Tablet (All 9 Formats Inside)',
        price: 319.00,
        originalPrice: 429.00,
        fileFormat: '7.8" E-Ink Carta 1200 Hardware Tablet (Preloaded)',
        fileSize: '64 GB Dedicated Solid-State Vault',
        sampleLength: 'Interactive Hardware & OS Preview',
        available: true,
        features: [
          'Dedicated hardware device built solely for this comprehensive AI masterwork',
          'Zero-distraction Neural OS (dedicated single-book firmware terminal)',
          'Pre-loaded offline with all 9 other dimensions (eBook, Audio, Video, Manuscript, Hardcover, Paperback, SD, Music, Silk/Cotton)',
          '7.8" 300 PPI glare-free ambient screen with syntax-sharpening display',
          'Dual 3.5mm headphone jack, low-latency Bluetooth 5.3 & 10-week battery'
        ]
      }
    },
    tags: ['AI Agents', 'Architecture', 'TypeScript', 'Python', 'Machine Learning']
  },
  {
    id: 'book-systems-transcendence',
    slug: 'systems-of-transcendence',
    title: 'Systems of Transcendence: Philosophy for the Post-Information Century',
    subtitle: 'Navigating Meaning, Sovereignty, and the Sacred in an Era of Infinite Synthetic Noise',
    author: 'Jonathan Blue',
    authorBio: 'Jonathan Blue is the founding patron of Johnnyblue1 Books Stores and Knowledge Centa. An essayist, collector of rare manuscripts, and explorer of digital ethics.',
    authorId: 'author-marcus-sterling',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    category: 'Philosophy & Essays',
    rating: 4.95,
    reviewCount: 1890,
    publishedDate: 'December 2025',
    publisher: 'Johnnyblue1 Books Stores Publishing House',
    isbn: '978-0-1111111-1-1',
    pages: 350,
    language: 'English',
    bestSellerCategory: '#1 in Contemporary Philosophy & Digital Ethics',
    editorsPick: true,
    description: `What happens to human consciousness when the marginal cost of creating synthetic reality drops to absolute zero?

Jonathan Blue constructs an indispensable philosophical sanctuary in "Systems of Transcendence", exploring how the human spirit preserves authentic meaning, depth, and creative spark.`,
    chapterOnePreview: {
      title: 'Chapter 1: The Sanctuary of Attention',
      subheading: 'Re-discovering quietude within the planetary compute machine.',
      content: [
        'There is an ancient silence that precedes all creative endeavor. It is the silence of the monk in the scriptorium before the quill touches parchment; it is the stillness of the astronomer awaiting twilight on a mountain ridge.',
        'Today, this silence is the rarest commodity in the solar system. Every millisecond, billions of algorithmic tendrils probe the nervous systems of eight billion souls, calculating how to auction fractions of human awareness to highest bidders.',
        'To establish a sanctuary for one’s attention is no longer merely a lifestyle choice—it is a radical act of spiritual defiance.'
      ]
    },
    audioSample: {
      title: 'Systems of Transcendence (Immersive Audio)',
      narrator: 'Jonathan Blue (Original Voice Recording)',
      durationSeconds: 25200,
      sampleDurationSeconds: 300,
      audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
      chapterList: [
        { name: 'Overture: The Cathedral of Thought', duration: '14:00' },
        { name: 'Chapter 1: The Sanctuary of Attention', duration: '46:12' },
        { name: 'Chapter 2: Craft as an Anchor in Chaos', duration: '54:20' }
      ]
    },
    videoSample: {
      title: 'Systems of Transcendence: Cinematic Visual Essay',
      resolution: '4K Cinema 24fps with Custom Ambient Score',
      durationSeconds: 12600,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      aspectRatio: '21:9',
      companionNotesPreview: 'High-definition cinematography filmed across Kyoto, the Swiss Alps, and the Scottish Highlands.'
    },
    manuscriptSample: {
      version: 'Author Personal Parchment & Draft Notes (v1.9)',
      notebookType: 'Handmade Italian Calfskin Leather Journal (Handwritten Calligraphy & Ink Draft)',
      draftStatus: 'Authentic Uncut Handwritten Scan',
      lastUpdated: 'November 2025',
      authorMarginNotes: [
        { paragraphIndex: 0, note: 'JB: Quote Seneca’s letter VII in the final marginalia calligraphy.' }
      ],
      handwrittenNotebook: {
        title: 'The Solitude Journal (Original Scans in Italian Calfskin)',
        medium: 'Namiki Falcon Extra-Fine with Pilot Iroshizuku Take-sumi on 160gsm Handmade Deckle-Edge Paper',
        totalPages: 160,
        scannedPages: [
          {
            pageNumber: 1,
            imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
            transcription: 'Kyoto, Autumn 2025.\nIn the temple garden of Ryoan-ji, fifteen stones are arranged in white gravel. From no vantage point can all fifteen stones be seen at once.\nSuch is human knowledge: we are forever bounded by perspective, yet forever called to venerate the unseen whole.',
            authorAnnotation: 'Opening reflection handwritten in Kyoto temple courtyard.'
          }
        ]
      }
    },
    musicalAlbumSample: {
      albumTitle: 'Cathedrals of Stillness: Original Ambient Soundtrack',
      composer: 'Jonathan Blue & Kyoto String Ensemble',
      totalDuration: '46 min 15 sec',
      genre: 'Acoustic Ambient / Cello & Japanese Flute',
      coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      tracks: [
        {
          id: 'st-track-1',
          trackNumber: 1,
          title: 'The Scriptorium Silence',
          duration: '6:30',
          audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
          description: 'Solo cello and subtle bamboo flute capturing contemplation and spiritual peace.'
        }
      ]
    },
    hardcoverDetails: {
      binding: 'Fine Italian Book Cloth with Deep Copper Foil Embossing',
      foilStamping: 'Burnished Copper Foil on Forest Green Buckram',
      ribbonColor: 'Emerald Silk Ribbon',
      weight: '1.9 lbs',
      shippingEstimate: 'Ships in 2-3 business days'
    },
    papercoverDetails: {
      paperStock: '70lb Antique Laid Paper',
      finish: 'Soft-Touch Matte with French Flaps',
      dimensions: '5.5" x 8.5" Literary Paperback',
      shippingEstimate: 'Ships in 2-4 business days'
    },
    pendriveSdDetails: {
      storageCapacity: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
      connector: 'Dual USB-C / USB 3.2 Metal Alloy',
      includesCardReader: true,
      preloadedContents: [
        'Cinematic 4K Visual Essay filmed in 21:9 ultrawide cinema format',
        '24-Bit / 96kHz Master FLAC Audiobook voiced by Jonathan Blue',
        'Full Scans of Handmade Deckle-Edge Calligraphy Journals',
        'Lossless Audio Album "Cathedrals of Stillness"',
        'EPUB3 & Curated Print PDF editions'
      ]
    },
    silkCottonDetails: {
      material: 'Wild Habotai Silk & Hand-Woven Egyptian Cotton Damask',
      binding: 'Heritage Japanese 4-Hole Silk-Thread Binding with Mulberry Silk Fabric Spine',
      artisanOrigin: 'Kyoto Imperial Textile Workshop & Venetian Heritage Bindery',
      edgeFinishing: 'Hand-Deckled Edges with Burnished Rose Gold Leaf Gilding',
      slipcase: 'Cloth-Bound Solander Preservation Box with Cedar Wood Inlay',
      limitedEditionUnits: 250,
      shippingEstimate: 'Ships in 3-5 business days (White-Glove Insured Courier)'
    },
    digitalDeviceDetails: {
      deviceName: 'The Sanctuary E-Ink Folio (Dedicated Single-Book Slate)',
      screenTech: '7.8-inch 300 PPI E-Ink Carta 1200 Amber Warm-Glow Glare-Free Display',
      enclosureMaterial: 'Precision CNC Machined Anodized Warm Bronze Aluminum with Milled Brass Buttons',
      storageCapacity: '64GB Ultra-Fast Solid-State Storage',
      batteryLife: '10 Weeks Standby, 48 Hours Continuous Reading',
      audioJack: 'Dual 3.5mm Audiophile Gold-Plated Port + Bluetooth 5.3 LDAC',
      firmwareOS: 'Sanctuary OS (Pure Reading Sanctuary, Zero WiFi Notifications, Boots Solely into this Masterwork)',
      bundledDimensionsCarried: [
        '1. eBook: Bespoke serif typography & decorative illuminated drop caps',
        '2. Audiobook: 24-Bit / 96kHz acoustic meditation narration by Jonathan Blue',
        '3. 4K Video Book: Cinematic 21:9 ultrawide philosophy essay & companion reflections',
        '4. Raw Handwritten Manuscript: 600 DPI scans of handmade deckle calligraphy notebooks',
        '5. Hardcover Print Facsimile: Typographic layout of forest green buckram edition',
        '6. Paper Cover Layout: High-contrast French-flap reading format',
        '7. Hardware SD Vault: Offline master audiovisual archive & digital certificates',
        '8. Musical Album: "Cathedrals of Stillness" ambient score in uncompressed FLAC',
        '9. Silk & Cotton Archive: High-resolution weave photography & workshop documentation'
      ],
      includedAccessories: [
        'Cognac Tuscan Vachetta Leather Magnetic Sleep Folio',
        'Braided USB-C Charging Cord',
        'Antiqued Brass Bookmark Seal',
        'Calligraphed Certificate of Device Ownership'
      ],
      shippingEstimate: 'White-Glove Insured Courier Tracked Delivery (2-3 Days)'
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'eBook (EPUB / PDF)',
        badge: 'Artisan Typography',
        price: 13.99,
        originalPrice: 18.99,
        fileFormat: 'EPUB3 & Curated Print PDF',
        fileSize: '16.5 MB',
        sampleLength: 'Chapter 1 & Overture',
        available: true,
        features: ['Custom serif typography & drop caps', 'Offline reading in Knowledge Centa web app']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Audiobook (MP3 / M4B)',
        badge: 'Ambient Master',
        price: 23.50,
        originalPrice: 28.50,
        fileFormat: '320kbps MP3 with subtle ambient acoustic beds',
        fileSize: '440 MB',
        duration: '7 hr 00 min',
        sampleLength: '5 min 00 sec Sample',
        available: true,
        features: ['Voiced by Jonathan Blue with bespoke orchestral score', 'Lossless dynamic master']
      },
      videobook: {
        type: 'videobook',
        name: 'Video Book (4K Cinema Essay)',
        badge: 'Cinematic Visual Novel',
        price: 32.00,
        originalPrice: 45.00,
        fileFormat: '4K Cinema 24fps MP4',
        fileSize: '3.4 GB',
        duration: '3 hr 30 min',
        sampleLength: 'Cinematic Overture (6 min)',
        available: true,
        features: ['Filmed on 35mm film scanners & digital cinema', 'Includes director commentary audio track']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Raw Handwritten Manuscript',
        badge: 'Authentic Notebook Scans',
        price: 65.00,
        originalPrice: 95.00,
        fileFormat: '600 DPI Scans of Handmade Leather Journal',
        fileSize: '88.5 MB',
        sampleLength: 'Kyoto Journals & Author Calligraphy',
        available: true,
        features: ['Full scans of Jonathan Blue handwritten Italian leather journal', 'Calligraphy ink marginalia & unedited philosophical essays']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Hardcover (Forest Green Cloth)',
        badge: 'Artisan Heirloom',
        price: 42.00,
        originalPrice: 52.00,
        fileFormat: 'Clothbound Hardcover with French Flaps (Physical)',
        fileSize: '350 Printed Pages',
        sampleLength: 'Binding Details & Preface',
        available: true,
        features: ['Burnished copper foil stamping on forest green buckram', 'Emerald silk ribbon bookmark & Smyth-sewn binding', 'Free digital cloud sync']
      },
      papercover: {
        type: 'papercover',
        name: 'Paper Cover (French Flaps)',
        badge: 'Literary Paperback',
        price: 21.00,
        originalPrice: 27.00,
        fileFormat: '5.5x8.5 Literary Paperback with French Flaps',
        fileSize: '350 Printed Pages',
        sampleLength: 'Chapter 1',
        available: true,
        features: ['Antique laid paper with generous margins', 'Elegant French flaps with author essay excerpts', 'Free digital sync']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Pendrive & Memory Card / SD-Card',
        badge: 'Collector USB-C / Micro-SD Vault',
        price: 85.00,
        originalPrice: 115.00,
        fileFormat: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
        fileSize: '64 GB Storage Vault',
        sampleLength: 'Vault Contents Spec',
        available: true,
        features: ['Dual USB-C & USB-A metal drive with laser-engraved quote', 'Includes 64GB Micro-SD card & USB adapter', 'Preloaded with 4K ultrawide cinema essay, FLAC audio & calligraphy scans']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Musical Album (Stillness Score)',
        badge: 'Original Ambient Score',
        price: 17.50,
        originalPrice: 24.00,
        fileFormat: '24-Bit / 96kHz FLAC & 320kbps MP3',
        fileSize: '380 MB',
        duration: '46 min 15 sec',
        sampleLength: 'Scriptorium Silence Preview (4 min)',
        available: true,
        features: ['Acoustic cello & traditional bamboo flute compositions', 'Recorded in acoustic cathedrals & Kyoto courtyards', 'Lossless master files + instant streaming']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Silk / Cotton Material Edition',
        badge: 'Artisanal Woven Cloth',
        price: 110.00,
        originalPrice: 155.00,
        fileFormat: 'Habotai Silk & Damask Cotton Weave (Physical)',
        fileSize: '350 Handcrafted Pages',
        sampleLength: 'Japanese Silk Binding & Rose Gold Deckle Edges',
        available: true,
        features: [
          'Hand-bound in raw Mulberry silk & Japanese indigo cotton weave',
          'Traditional 4-hole Japanese silk thread binding with rose gold leaf edges',
          'Includes cedar wood inlay Solander box & calligraphed certificate'
        ]
      },
      digital_device: {
        type: 'digital_device',
        name: 'Digital Device (Dedicated E-Reader)',
        badge: 'Dedicated Tablet (All 9 Formats Inside)',
        price: 329.00,
        originalPrice: 449.00,
        fileFormat: '7.8" E-Ink Carta 1200 Hardware Tablet (Preloaded)',
        fileSize: '64 GB Dedicated Solid-State Vault',
        sampleLength: 'Interactive Hardware & OS Preview',
        available: true,
        features: [
          'Dedicated hardware device built solely for this philosophical masterwork',
          'Zero-distraction Sanctuary OS (boots directly into the book)',
          'Pre-loaded offline with all 9 other dimensions (eBook, Audio, Video, Manuscript, Hardcover, Paperback, SD, Music, Silk/Cotton)',
          '7.8" 300 PPI amber glow ambient display with brass physical buttons',
          'Dual 3.5mm audiophile headphone jack + Bluetooth 5.3 LDAC'
        ]
      }
    },
    tags: ['Philosophy', 'Digital Ethics', 'Mindfulness', 'Essays', 'Sanctuary']
  },
  {
    id: 'book-alchemists-codex',
    slug: 'the-alchemists-codex',
    title: "The Alchemist's Codex: Handwritten Grimoire & Studio Folio",
    subtitle: '600 DPI Archival Fountain Pen Manuscripts, Marginalia & Experimental Theorems',
    author: 'Master Lucian Vane',
    authorBio: 'Lucian Vane is an Oxford philologist and calligraphic artist whose illuminated folios are preserved in university archives across Europe and the Americas.',
    authorId: 'author-lucian-vane',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1000&q=80',
    category: 'Raw Handwritten Manuscripts',
    rating: 4.95,
    reviewCount: 894,
    publishedDate: 'February 2026',
    publisher: 'Knowledge Centa Manuscript Vault',
    isbn: '978-0-9876543-6-9',
    pages: 412,
    language: 'English & Latin',
    bestSellerCategory: '#1 Best Seller in Archival Manuscripts & Calligraphy',
    editorsPick: true,
    description: 'An extraordinary primary-source artifact: the complete unfiltered working manuscripts of Master Lucian Vane, scanned at ultra-high-resolution 600 DPI directly from handmade cotton paper folios. Features intimate marginal notes, canceled passages, alchemical diagrams, and historical ink recipes.',
    chapterOnePreview: {
      title: 'Folio 1: The Geometry of the Quill',
      subheading: 'On the viscosity of walnut ink and the discipline of deliberate notation.',
      content: [
        'Before a thought is crystallized into type, it lives in the hand. The friction of the nib upon rough deckled rag generates a cadence that digital keystrokes can never mimic.',
        'These leaves represent twenty-two years of solitude. In every margin you will find cross-references, deletions, and second thoughts that reveal how an idea genuinely germinates in human consciousness.',
        'Study not merely the text, but the weight of the pressure and the hesitation of the ink.'
      ]
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'eBook Edition',
        badge: 'High-Res PDF & EPUB',
        price: 14.99,
        originalPrice: 19.99,
        fileFormat: 'PDF + EPUB3',
        fileSize: '48.2 MB',
        available: true,
        features: ['Full color manuscript scan plates', 'Text transcription overlay', 'Offline reading enabled']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Audiobook Commentary',
        badge: 'Author Dictation',
        price: 19.99,
        originalPrice: 24.99,
        fileFormat: 'MP3 320kbps',
        fileSize: '310 MB',
        duration: '9h 15m',
        sampleLength: '6m',
        available: true,
        features: ['Author personal narration', 'Ambient studio acoustic background', 'Folio-by-folio commentary']
      },
      videobook: {
        type: 'videobook',
        name: '4K Calligraphic Cinema',
        badge: '4K UHD Macro',
        price: 29.99,
        originalPrice: 39.99,
        fileFormat: 'MP4 (4K HDR)',
        fileSize: '4.8 GB',
        duration: '4h 30m',
        available: true,
        features: ['Macro lens ink drying captures', 'Illumination gilding process', 'Studio documentary']
      },
      manuscript: {
        type: 'manuscript',
        name: '600 DPI Studio Scans',
        badge: 'Collector Master',
        price: 49.99,
        originalPrice: 65.00,
        fileFormat: 'TIFF + Lossless PDF',
        fileSize: '2.1 GB',
        available: true,
        features: ['Uncompressed 600 DPI archival scans', 'Full margins and deckle edges', 'Authenticity certificate']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Leatherbound Folio',
        badge: 'Physical Collector',
        price: 85.00,
        fileFormat: 'Physical Book',
        fileSize: '3.2 kg',
        available: true,
        features: ['Full Italian goatskin binding', 'Gold foil spine debossing', 'Hand-sewn headband']
      },
      papercover: {
        type: 'papercover',
        name: 'Trade Study Edition',
        badge: 'Paperback',
        price: 24.99,
        fileFormat: 'Physical Book',
        fileSize: '750 g',
        available: true,
        features: ['Heavy archival paper', 'Lay-flat binding', 'Complete transcriptions']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Brass Key USB Vault',
        badge: 'Metal Drive',
        price: 55.00,
        fileFormat: 'Hardware 128GB',
        fileSize: '128 GB',
        available: true,
        features: ['Heavyweight antique brass housing', 'All 10 dimensions preloaded', 'Offline hardware archive']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Monastery Soundscapes',
        badge: '24-bit FLAC',
        price: 18.99,
        fileFormat: 'FLAC 96kHz/24bit',
        fileSize: '680 MB',
        duration: '1h 45m',
        available: true,
        features: ['Gregorian acoustic reverberation', 'Cathedral organ and cello', 'Audiophile studio master']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Silk Thread Binding',
        badge: 'Artisanal Folio',
        price: 120.00,
        fileFormat: 'Artisan Textile',
        fileSize: '1.8 kg',
        available: true,
        features: ['Kyoto silk wrapper', 'Unbleached rag paper', 'Limited numbered print run']
      },
      digital_device: {
        type: 'digital_device',
        name: 'Sanctuary Folio Reader',
        badge: 'Custom E-Ink',
        price: 349.00,
        fileFormat: 'Hardware Device',
        fileSize: '380 g',
        available: true,
        features: ['10.3" Carta 1200 high contrast display', 'Wacom electromagnetic pen support', 'Dedicated offline OS']
      }
    },
    tags: ['Manuscript', 'Archival', 'Calligraphy', 'Folio', 'History']
  },
  {
    id: 'book-symphonies-infinite',
    slug: 'symphonies-of-the-infinite',
    title: 'Symphonies of the Infinite: Orchestral Scorebook & Acoustic Master',
    subtitle: 'Full Conductor Score, 24-Bit FLAC Spatial Audio, and Philosophical Essays on Harmony',
    author: 'Maestro Kaelen Ross',
    authorBio: 'Maestro Kaelen Ross is an internationally celebrated composer and acoustic researcher whose spatial orchestral compositions have been performed at the Royal Albert Hall.',
    authorId: 'author-kaelen-ross',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1000&q=80',
    category: 'Musical Albums & Scores',
    rating: 4.88,
    reviewCount: 642,
    publishedDate: 'January 2026',
    publisher: 'Harmonic Centa Audiophile Editions',
    isbn: '978-0-9876543-7-6',
    pages: 320,
    language: 'English',
    bestSellerCategory: '#1 Best Seller in Orchestral Scores & Soundtracks',
    editorsPick: true,
    description: 'A monument of multi-dimensional acoustic art: Maestro Ross pairs his full conductor scorebooks with 24-bit 96kHz spatial orchestral master recordings, deep theoretical essays on modal acoustics, and annotated sketches.',
    chapterOnePreview: {
      title: 'Movement I: The Resonance of Open Space',
      subheading: 'Why frequency dictates consciousness and the math of sovereign soundscapes.',
      content: [
        'A single sustained cello harmonic does not merely vibrate air; it structures the physical room. Long before language arose, resonance communicated fear, reverence, and rapture.',
        'This score was written in isolation in the Swiss Alps, capturing the acoustic decay of open snowfields and glacial amphitheaters.',
        'We invite the reader to listen with open headphones while tracing the contrapuntal lines upon the engraved score.'
      ]
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'Digital Conductor Score',
        badge: 'Interactive Score',
        price: 12.99,
        fileFormat: 'Vector PDF',
        fileSize: '32.1 MB',
        available: true,
        features: ['Crisp zoomable musical notation', 'Embedded audio cues', 'Conductor commentary notes']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Acoustic Lecture Series',
        badge: 'Masterclass',
        price: 18.99,
        fileFormat: 'MP3 320kbps',
        fileSize: '240 MB',
        duration: '7h 20m',
        available: true,
        features: ['Maestro Ross spoken breakdown', 'Piano illustrations', 'Audio score synchronization']
      },
      videobook: {
        type: 'videobook',
        name: 'London Philharmonic 4K Concert',
        badge: '4K Dolby Atmos',
        price: 24.99,
        fileFormat: 'MP4 (4K HDR)',
        fileSize: '5.2 GB',
        duration: '2h 15m',
        available: true,
        features: ['Multi-camera orchestral recording', 'Synchronized conductor score scrolling', 'Dolby Atmos mix']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Original Orchestral Drafts',
        badge: 'Composer Notes',
        price: 34.99,
        fileFormat: 'High-Res PDF',
        fileSize: '410 MB',
        available: true,
        features: ['Pencil and ink draft folios', 'Tempo notations and revisions', 'Collector digital proof']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Deluxe Conductor Folio',
        badge: 'Oversized Print',
        price: 75.00,
        fileFormat: 'Physical Book',
        fileSize: '2.5 kg',
        available: true,
        features: ['11x17 oversized score folio', 'Spiral lay-flat binding', 'Embossed linen cloth cover']
      },
      papercover: {
        type: 'papercover',
        name: 'Study Score Paperback',
        badge: 'Pocket Score',
        price: 19.99,
        fileFormat: 'Physical Book',
        fileSize: '450 g',
        available: true,
        features: ['Portable format for students', 'Complete orchestration', 'Historical essays']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Audiophile Master SD Card',
        badge: 'Lossless Vault',
        price: 49.99,
        fileFormat: 'Hardware 64GB',
        fileSize: '64 GB',
        available: true,
        features: ['Uncompressed 24-bit 96kHz FLAC', 'High-res artwork and score files', 'Gold contact SD card']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Complete Spatial Album',
        badge: '24-Bit FLAC',
        price: 19.99,
        fileFormat: 'FLAC 96kHz/24bit',
        fileSize: '1.2 GB',
        duration: '1h 38m',
        available: true,
        features: ['Original master recording', 'Dynamic range DR14', 'Spatial stereo & binaural mixes']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Concert Silk Program',
        badge: 'Silk Bound',
        price: 95.00,
        fileFormat: 'Artisan Textile',
        fileSize: '1.2 kg',
        available: true,
        features: ['Silk moiré binding', 'Hand-lettered calligraphic cover', 'Numbered first edition']
      },
      digital_device: {
        type: 'digital_device',
        name: 'Sanctuary Audio Player',
        badge: 'LDAC Player',
        price: 299.00,
        fileFormat: 'Hardware Device',
        fileSize: '220 g',
        available: true,
        features: ['Dual Cirrus Logic DACs', 'Balanced 4.4mm output', 'Zero wifi distractions']
      }
    },
    tags: ['Music', 'Orchestral', 'Scores', 'Audiophile', 'Soundtrack']
  },
  {
    id: 'book-gutenberg-vault',
    slug: 'the-gutenberg-vault',
    title: 'The Gutenberg Vault: Chronology of Rare Typographic Masterpieces',
    subtitle: 'From Movable Metal Casts to Algorithmic Micro-Typography: Five Centuries of Bookcraft',
    author: 'Vivienne Chen',
    authorBio: 'Vivienne Chen is an award-winning typographic designer, rare book conservator, and former guest curator at the Plantin-Moretus Museum in Antwerp.',
    authorId: 'author-vivienne-chen',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
    category: 'Collector Physical Media',
    rating: 4.92,
    reviewCount: 512,
    publishedDate: 'March 2026',
    publisher: 'Vault Antiquarian Press',
    isbn: '978-0-9876543-8-3',
    pages: 480,
    language: 'English',
    bestSellerCategory: '#1 Best Seller in Book Arts & Typography',
    editorsPick: true,
    description: 'An authoritative, visually arresting exploration of the physical architecture of books. Vivienne Chen documents the evolution of metal type punches, rag paper chemistry, leather tooling, and sovereign printing presses that survived censorship across five centuries.',
    chapterOnePreview: {
      title: 'Chapter 1: The Weight of Lead and Antimony',
      subheading: 'Why physical books resist digital obsolescence and memory decay.',
      content: [
        'When you hold an incunabulum printed in 1480, you are touching rag fiber beaten from medieval flax shirts and linen sails. The ink, bound with boiled walnut oil and soot, has not faded by a single optical percentage point in five hundred and forty years.',
        'Contrast this with digital files: formats migrate, cloud hosts shutter, accounts get terminated. The physical book is not an antique relic; it is an unhackable decentralized cold storage node for human thought.'
      ]
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'Digital Reference Edition',
        badge: 'High-Res eBook',
        price: 11.99,
        fileFormat: 'EPUB3 + PDF',
        fileSize: '38 MB',
        available: true,
        features: ['Full color typeface specimen plates', 'Interactive chronology timeline', 'Hyperlinked index']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Narrated Chronology',
        badge: 'Full Audio',
        price: 16.99,
        fileFormat: 'MP3 320kbps',
        fileSize: '290 MB',
        duration: '8h 40m',
        available: true,
        features: ['Narrated by Vivienne Chen', 'Interviews with Master Printers', 'Acoustic press soundscapes']
      },
      videobook: {
        type: 'videobook',
        name: 'The Printing Guild 4K Doc',
        badge: '4K Cinema',
        price: 22.99,
        fileFormat: 'MP4 4K',
        fileSize: '3.9 GB',
        duration: '3h 10m',
        available: true,
        features: ['Hot metal typecasting footage', 'Heidelberg cylinder press in motion', 'Antwerp archive tour']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Punchcutter Specimen Sheets',
        badge: 'Archival Plates',
        price: 32.99,
        fileFormat: 'PDF Scans',
        fileSize: '380 MB',
        available: true,
        features: ['16th century type specimen scans', 'Magnified punch details', 'Watermark tracings']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Letterpress Hardcover',
        badge: 'Clothbound',
        price: 68.00,
        fileFormat: 'Physical Book',
        fileSize: '1.9 kg',
        available: true,
        features: ['German bookcloth with foil stamping', 'Smyth-sewn lay-flat signatures', 'Heavy mohawk superfine paper']
      },
      papercover: {
        type: 'papercover',
        name: 'Standard Monograph',
        badge: 'Trade Paper',
        price: 22.50,
        fileFormat: 'Physical Book',
        fileSize: '680 g',
        available: true,
        features: ['French flap cover', 'High opacity cream paper', 'Complete bibliography']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Archival Vault USB',
        badge: 'Metal Drive',
        price: 45.00,
        fileFormat: 'Hardware USB-C',
        fileSize: '64 GB',
        available: true,
        features: ['Solid aluminum case', 'Preloaded with high-res font specimens', 'Lifetime offline durability']
      },
      musical_album: {
        type: 'musical_album',
        name: 'The Pressroom Rhythms',
        badge: 'Ambient Study',
        price: 14.99,
        fileFormat: 'FLAC / MP3',
        fileSize: '420 MB',
        duration: '1h 12m',
        available: true,
        features: ['Mechanical rhythm ambience', 'Low-tempo focus soundscapes', 'Binaural press audio']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Hand-Marbled Silk Slipcase',
        badge: 'Artisan Collector',
        price: 110.00,
        fileFormat: 'Artisan Textile',
        fileSize: '2.1 kg',
        available: true,
        features: ['Hand-marbled Italian paper slipcase', 'Silk ribbon placemarkers', 'Hand-stamped ex-libris']
      },
      digital_device: {
        type: 'digital_device',
        name: 'Sanctuary E-Reader Monolith',
        badge: 'Dedicated Device',
        price: 329.00,
        fileFormat: 'Hardware Device',
        fileSize: '310 g',
        available: true,
        features: ['Custom serif fonts preloaded', 'Glass-free matte screen', '6-week battery life']
      }
    },
    tags: ['Typography', 'Printing', 'History', 'Collector', 'Design']
  },
  {
    id: 'book-woven-solitude',
    slug: 'woven-solitude',
    title: 'Woven Solitude: Kyoto Silk Thread Bindery & Botanical Essays',
    subtitle: 'Wabi-Sabi Aesthetics, Hand-Dyed Indigo Fibers, and Meditations on Organic Craftsmanship',
    author: 'Suki Takahashi',
    authorBio: 'Suki Takahashi is a Kyoto-born textile artisan, naturalist essayist, and fifth-generation master of traditional Japanese bookbinding (Watoji).',
    authorId: 'author-suki-takahashi',
    coverImage: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80',
    category: 'Artisanal Silk & Cotton Editions',
    rating: 4.96,
    reviewCount: 420,
    publishedDate: 'February 2026',
    publisher: 'Kyoto Artisan Press & Johnnyblue1 International',
    isbn: '978-0-9876543-9-0',
    pages: 288,
    language: 'English & Japanese',
    bestSellerCategory: '#1 Best Seller in Japanese Arts & Artisan Textiles',
    editorsPick: true,
    description: 'An intimate pilgrimage into the art of slow creation. Master artisan Suki Takahashi weaves together botanical prose, Japanese bookbinding traditions, natural fermentation indigo dyeing, and meditations on stillness in an overstimulated era.',
    chapterOnePreview: {
      title: 'Chapter 1: The Indigo Vat at Sunrise',
      subheading: 'Living microbes, patience, and the blue that deepens with century-long age.',
      content: [
        'An indigo vat is not a chemical solution; it is a living colony of fermenting bacteria fed with wheat bran, sake, and wood ash. It breathes. On cold winter mornings in Kyoto, we wrap the earthenware vats in straw quilts to keep the fermentation alive.',
        'When silk thread emerges from the liquid, it is not blue—it is bright chartreuse. Only as it breathes oxygen in the morning air does it turn into deep, meditative indigo.'
      ]
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'Artisan Illustrated eBook',
        badge: 'eBook Edition',
        price: 10.99,
        fileFormat: 'EPUB3 + PDF',
        fileSize: '42 MB',
        available: true,
        features: ['High-resolution botanical photographs', 'Japanese typography details', 'Audio chapter links']
      },
      audiobook: {
        type: 'audiobook',
        name: 'Zen Garden Audio Essays',
        badge: 'Binaural Audio',
        price: 15.99,
        fileFormat: 'MP3 320kbps',
        fileSize: '210 MB',
        duration: '6h 15m',
        available: true,
        features: ['Narrated by Suki Takahashi', 'Natural Kyoto garden rain acoustics', 'Shakuhachi flute interludes']
      },
      videobook: {
        type: 'videobook',
        name: 'The Kyoto Bindery Documentary',
        badge: '4K Cinema',
        price: 21.99,
        fileFormat: 'MP4 4K',
        fileSize: '3.6 GB',
        duration: '2h 45m',
        available: true,
        features: ['Step-by-step Watoji binding demonstration', 'Indigo harvesting in Tokushima', 'Studio sound design']
      },
      manuscript: {
        type: 'manuscript',
        name: 'Botanical Sketchbook Folios',
        badge: 'Watercolor Scans',
        price: 28.99,
        fileFormat: 'High-Res Scans',
        fileSize: '310 MB',
        available: true,
        features: ['Hand-drawn botanical flora illustrations', 'Calligraphic poetry notes', 'Authentic ink brush strokes']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Watoji Clothbound Volume',
        badge: 'Exquisite Binding',
        price: 62.00,
        fileFormat: 'Physical Book',
        fileSize: '1.4 kg',
        available: true,
        features: ['Exposed four-hole Japanese stab binding', 'Organic cotton paper', 'Embossed indigo cover']
      },
      papercover: {
        type: 'papercover',
        name: 'Paperback Companion',
        badge: 'Compact Edition',
        price: 18.99,
        fileFormat: 'Physical Book',
        fileSize: '420 g',
        available: true,
        features: ['Textured kraft cover', 'Warm cream paper', 'Full English translation']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'Bamboo USB Vault',
        badge: 'Eco Hardware',
        price: 39.99,
        fileFormat: 'Hardware USB-C',
        fileSize: '64 GB',
        available: true,
        features: ['Sustainably harvested bamboo shell', 'All 10 formats preloaded', 'Engraved Kanji logo']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Kyoto Rain Soundscapes',
        badge: 'Relaxation Audio',
        price: 14.99,
        fileFormat: 'FLAC / MP3',
        fileSize: '510 MB',
        duration: '1h 30m',
        available: true,
        features: ['Bamboo water fountain recordings', 'Koto and Shakuhachi meditation', 'Pure acoustic silence']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Hand-Dyed Indigo Silk Edition',
        badge: 'Master Silk Artisan',
        price: 135.00,
        fileFormat: 'Artisan Textile',
        fileSize: '1.6 kg',
        available: true,
        features: ['Woven with 100% natural indigo silk thread', 'Kozo mulberry handmade paper', 'Signed and sealed by Suki Takahashi']
      },
      digital_device: {
        type: 'digital_device',
        name: 'Sanctuary Reader Bamboo Edition',
        badge: 'Custom Device',
        price: 359.00,
        fileFormat: 'Hardware Device',
        fileSize: '320 g',
        available: true,
        features: ['Warm amber ambient reading light', 'Tactile bamboo rear cover', 'Zero-distraction zen interface']
      }
    },
    tags: ['Artisanal', 'Textiles', 'Japan', 'Mindfulness', 'Watoji']
  },
  {
    id: 'book-sanctuary-codex',
    slug: 'the-sanctuary-codex',
    title: 'The Sanctuary Codex: Pure E-Ink Distraction-Free Philosophy',
    subtitle: 'Hardware Architecture, Attention Sovereignty, and Building Tools That Respect Human Dignity',
    author: 'Johnny Blue & The Sovereign Fellowship',
    authorBio: 'Johnny Blue is a technologist, open-source privacy advocate, and founder of Johnnyblue1 Books and Knowledge Centa. He champions calm computing and sovereign reader freedom.',
    authorId: 'author-johnny-blue',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80',
    category: 'Dedicated Digital Devices',
    rating: 4.98,
    reviewCount: 1650,
    publishedDate: 'March 2026',
    publisher: 'Knowledge Centa Hardware Labs & Sovereign Press',
    isbn: '978-0-9876543-0-6',
    pages: 360,
    language: 'English',
    bestSellerCategory: '#1 Best Seller in Hardware Philosophy & Human-Computer Ethics',
    editorsPick: true,
    description: 'The definitive manifesto for the calm technology movement. Johnny Blue outlines why modern smartphones are attention extraction slot machines, and presents the full open-source hardware schematics, firmware principles, and operating systems behind true Sanctuary reading hardware.',
    chapterOnePreview: {
      title: 'Chapter 1: The War on Continuous Attention',
      subheading: 'Why notifications are the modern cognitive polluter and how to build sanctuaries.',
      content: [
        'Every red notification bubble is a calculated strike against your prefrontal cortex. The world did not lose its capacity for deep contemplation because human beings changed; it lost it because our devices were engineered by casino psychologists.',
        'Sanctuary hardware begins with a radical premise: zero notifications, zero app store subscriptions, zero tracking telemetry, and a reflective screen that illuminates with the sun.'
      ]
    },
    formats: {
      ebook: {
        type: 'ebook',
        name: 'The Sanctuary Manifesto',
        badge: 'Open EPUB & PDF',
        price: 9.99,
        originalPrice: 14.99,
        fileFormat: 'EPUB3 + PDF',
        fileSize: '24 MB',
        available: true,
        features: ['DRM-free perpetual ownership', 'Open hardware schematics included', 'Optimized for E-Ink rendering']
      },
      audiobook: {
        type: 'audiobook',
        name: 'The Fellowship Narration',
        badge: 'Studio Voice',
        price: 14.99,
        originalPrice: 19.99,
        fileFormat: 'MP3 320kbps',
        fileSize: '275 MB',
        duration: '7h 45m',
        available: true,
        features: ['Full voice narration', 'Interviews with privacy architects', 'Calm acoustic pauses']
      },
      videobook: {
        type: 'videobook',
        name: 'Hardware Teardown & OS Blueprint',
        badge: '4K Lab Tour',
        price: 24.99,
        originalPrice: 34.99,
        fileFormat: 'MP4 4K',
        fileSize: '4.2 GB',
        duration: '3h 30m',
        available: true,
        features: ['PCB circuit layout walkthrough', 'E-ink waveform timing analysis', 'Linux kernel optimization']
      },
      manuscript: {
        type: 'manuscript',
        name: 'The Architectural Notebooks',
        badge: 'Schematics & Notes',
        price: 29.99,
        fileFormat: 'Vector PDF Scans',
        fileSize: '290 MB',
        available: true,
        features: ['Hand-drawn hardware diagrams', 'Keyboard layout prototypes', 'Author lab marginalia']
      },
      hardcover: {
        type: 'hardcover',
        name: 'Monolith Hardcover',
        badge: 'Matte Black',
        price: 59.00,
        fileFormat: 'Physical Book',
        fileSize: '1.5 kg',
        available: true,
        features: ['Deep matte black foil finish', 'Edge-gilded silver pages', 'Heavy archival stock']
      },
      papercover: {
        type: 'papercover',
        name: 'Field Manual Paperback',
        badge: 'Everyday Carry',
        price: 19.99,
        fileFormat: 'Physical Book',
        fileSize: '510 g',
        available: true,
        features: ['Weather-resistant flexible cover', 'Compact pocket size', 'Complete glossary']
      },
      pendrive_sd: {
        type: 'pendrive_sd',
        name: 'The Sovereign OS Bootable Drive',
        badge: 'Bootable USB-C',
        price: 49.99,
        fileFormat: 'Hardware 128GB',
        fileSize: '128 GB',
        available: true,
        features: ['Bootable Linux Sanctuary OS image', 'Complete offline repository of classics', 'Full 10 dimensions included']
      },
      musical_album: {
        type: 'musical_album',
        name: 'Monolith Ambient Soundscapes',
        badge: 'Binaural Focus',
        price: 14.99,
        fileFormat: 'FLAC 24-bit',
        fileSize: '490 MB',
        duration: '2h 00m',
        available: true,
        features: ['Deep focus generative synths', 'White and brown acoustic noise variants', '432Hz harmonic tuning']
      },
      silk_cotton: {
        type: 'silk_cotton',
        name: 'Organic Raw Cotton Edition',
        badge: 'Textile Edition',
        price: 99.00,
        fileFormat: 'Artisan Textile',
        fileSize: '1.3 kg',
        available: true,
        features: ['Unbleached organic raw cotton cloth', 'Letterpress printed on letterpress cotton rag', 'Numbered limited release']
      },
      digital_device: {
        type: 'digital_device',
        name: 'The Sanctuary Hardware Reader v2',
        badge: 'Flagship E-Ink',
        price: 299.00,
        originalPrice: 349.00,
        fileFormat: 'Hardware Device',
        fileSize: '315 g',
        available: true,
        features: ['7.8" 300 PPI Amber Glow Carta 1200', 'Preloaded with all 10 dimensions of this book', 'Hardware page turn buttons', '6-week battery life']
      }
    },
    tags: ['E-Ink', 'Hardware', 'Calm Tech', 'Privacy', 'Sanctuary']
  }
];

export const CATEGORIES = [
  'All Categories',
  'Business & Technology',
  'Psychology & Leadership',
  'Computer Science & AI',
  'Philosophy & Essays',
  'Raw Handwritten Manuscripts',
  'Musical Albums & Scores',
  'Collector Physical Media',
  'Artisanal Silk & Cotton Editions',
  'Dedicated Digital Devices'
];
