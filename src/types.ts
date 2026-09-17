export type FormatType = 
  | 'ebook' 
  | 'audiobook' 
  | 'videobook' 
  | 'manuscript'
  | 'hardcover'
  | 'papercover'
  | 'pendrive_sd'
  | 'musical_album'
  | 'silk_cotton'
  | 'digital_device';

export interface FormatOption {
  type: FormatType;
  name: string;
  badge: string;
  price: number;
  originalPrice?: number;
  fileFormat: string;
  fileSize: string;
  duration?: string;
  sampleLength?: string;
  available: boolean;
  features: string[];
}

export interface ChapterPreview {
  title: string;
  subheading?: string;
  content: string[];
}

export interface AudioSample {
  title: string;
  narrator: string;
  durationSeconds: number;
  sampleDurationSeconds: number;
  audioUrl: string;
  chapterList: { name: string; duration: string }[];
}

export interface VideoSample {
  title: string;
  resolution: string;
  durationSeconds: number;
  videoUrl: string;
  aspectRatio: string;
  companionNotesPreview?: string;
}

export interface HandwrittenPageScan {
  pageNumber: number;
  imageUrl: string;
  transcription: string;
  authorAnnotation?: string;
}

export interface HandwrittenNotebookSample {
  title: string;
  medium: string; // e.g. "Fountain Pen with Pelikan 4001 Ink on 120gsm Archival Paper"
  totalPages: number;
  scannedPages: HandwrittenPageScan[];
}

export interface ManuscriptSample {
  version: string;
  draftStatus: string;
  lastUpdated: string;
  notebookType?: string;
  authorMarginNotes: {
    paragraphIndex: number;
    note: string;
  }[];
  handwrittenNotebook?: HandwrittenNotebookSample;
}

export interface MusicalTrack {
  id: string;
  trackNumber: number;
  title: string;
  duration: string;
  audioUrl: string;
  description?: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  authorId?: string;
  coverImage: string;
  category: string;
  rating: number;
  reviewCount: number;
  publishedDate: string;
  publisher: string;
  isbn: string;
  pages: number;
  language: string;
  description: string;
  chapterOnePreview: ChapterPreview;
  audioSample?: AudioSample;
  videoSample?: VideoSample;
  manuscriptSample?: ManuscriptSample;
  // Newly Added 4 Dimensions
  musicalAlbumSample?: {
    albumTitle: string;
    composer: string;
    totalDuration: string;
    genre: string;
    coverUrl: string;
    tracks: MusicalTrack[];
  };
  // Hardcover & Paper Cover Physical Dimensions
  hardcoverDetails?: {
    binding: string;
    foilStamping: string;
    ribbonColor: string;
    weight: string;
    shippingEstimate: string;
  };
  papercoverDetails?: {
    paperStock: string;
    finish: string;
    dimensions: string;
    shippingEstimate: string;
  };
  // Pendrive / MemoryCard / SD-Card Dimension
  pendriveSdDetails?: {
    storageCapacity: string;
    connector: string;
    includesCardReader: boolean;
    preloadedContents: string[];
  };
  // Dimension 9: Silk or Cotton Material Dimension
  silkCottonDetails?: {
    material: string;
    binding: string;
    artisanOrigin: string;
    edgeFinishing: string;
    slipcase: string;
    limitedEditionUnits?: number;
    shippingEstimate: string;
  };
  // Dimension 10: Dedicated Digital Device Dimension
  // A dedicated hardware device (e.g. Kindle/e-ink tablet) meant solely for that book, carrying the other 9 dimensions
  digitalDeviceDetails?: {
    deviceName: string;
    screenTech: string;
    enclosureMaterial: string;
    storageCapacity: string;
    batteryLife: string;
    audioJack: string;
    firmwareOS: string;
    bundledDimensionsCarried: string[];
    includedAccessories: string[];
    shippingEstimate: string;
  };
  formats: Record<FormatType, FormatOption>;
  tags: string[];
  bestSellerCategory?: string;
  editorsPick?: boolean;
  draft2DigitalUrl?: string;
  authorWhatsapp?: string;
}

export interface AuthorSocialHandles {
  instagram: string;
  instagramUrl: string;
  instagramFollowers?: string;
  tiktok: string;
  tiktokUrl: string;
  tiktokFollowers?: string;
  youtube: string;
  youtubeUrl: string;
  youtubeSubscribers?: string;
  facebook: string;
  facebookUrl: string;
  facebookFollowers?: string;
  linkedin: string;
  linkedinUrl: string;
  linkedinFollowers?: string;
  twitter: string;
  twitterUrl: string;
  twitterFollowers?: string;
}

export interface AuthorBioData {
  penName: string;
  realName: string;
  academicTitle?: string;
  location: string;
  memberSince: string;
  birthEraOrOrigin?: string;
  genres: string[];
  educationOrBackground?: string;
  notableWorks: string[];
  publishingPhilosophy: string;
  bioSummary: string;
  fullBio: string;
  totalBooksPublished: number;
  totalReaders: number;
  verified: boolean;
  languagesSpoken: string[];
  contactEmail?: string;
}

export interface AuthorProfile {
  id: string;
  penName: string;
  realName?: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  payoutEmail: string;
  royaltyRate: number; // e.g., 0.85 = 85%
  verified: boolean;
  memberSince: string;
  location: string;
  websiteUrl?: string;
  twitterHandle?: string;
  socialHandles?: AuthorSocialHandles;
  bioData?: AuthorBioData;
  totalBooksPublished: number;
  totalReaders: number;
  totalEarningsEstimate: number;
  followersCount?: number;
  googleDriveConnected: boolean;
  googleDriveEmail?: string;
  googleDriveFolderId?: string;
  rawHandwrittenManuscripts?: {
    id: string;
    bookTitle: string;
    notebookName: string;
    pageCount: number;
    scanResolution: string;
    driveFileId?: string;
    driveViewLink?: string;
    thumbnailUrl: string;
    uploadedAt: string;
  }[];
  musicalAlbumsProduced?: {
    id: string;
    bookTitle: string;
    albumTitle: string;
    genre: string;
    driveFileId?: string;
    driveViewLink?: string;
    trackCount: number;
    uploadedAt: string;
  }[];
}

export interface UserUploadRecord {
  id: string;
  bookId?: string;
  authorName?: string;
  bookTitle?: string;
  materialType?: string;
  fileName: string;
  formatType?: FormatType;
  fileSize?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  driveFileId?: string;
  driveViewLink?: string;
  driveWebViewLink?: string;
  driveDownloadLink?: string;
  uploadedAt: string;
  syncedAt?: string;
  storageProvider?: 'Google Drive' | 'Cloudflare R2' | 'Firebase Firestore';
}

export interface CartItem {
  bookId: string;
  book: Book;
  format: FormatType;
  price: number;
  addedAt: number;
}

export interface LibraryItem {
  id: string;
  bookId: string;
  book: Book;
  format: FormatType;
  purchasedAt: string;
  signedAccessUrl?: string;
  lastProgress?: number;
  downloadCount: number;
  driveExportLink?: string;
  folderId?: string | null;
  folderName?: string | null;
  tags?: string[];
}

export interface CollectionFolder {
  id: string;
  name: string;
  description?: string;
  color: string; // e.g. 'amber', 'emerald', 'blue', 'purple', 'rose', 'indigo', 'teal'
  iconName?: string;
  createdAt: string;
  updatedAt?: string;
  isDefault?: boolean;
}

export interface LibraryExportBackup {
  appName: string;
  schemaVersion: string;
  exportedAt: string;
  exportTimestamp: number;
  user?: {
    name?: string;
    email?: string;
    uid?: string;
  };
  summary: {
    totalPurchasedEditions: number;
    totalUniqueTitles: number;
    totalFolders: number;
    formatsCount: Record<string, number>;
  };
  collectionFolders: CollectionFolder[];
  purchasedItems: {
    id: string;
    bookId: string;
    title: string;
    subtitle?: string;
    author: string;
    format: FormatType;
    formatLabel: string;
    category: string;
    publisher: string;
    purchasedAt: string;
    progressPercent: number;
    collectionFolder: string;
    collectionFolderId: string | null;
    description: string;
    isbn?: string;
    pages?: number;
    language?: string;
  }[];
}

export interface PublishFormData {
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  category: string;
  description: string;
  isbn: string;
  pages: number;
  language: string;
  coverImageFile: File | null;
  coverPreviewUrl: string;
  uploadToGoogleDrive?: boolean;
  draft2DigitalUrl?: string;
  authorWhatsapp?: string;
  enabledDimensions?: FormatType[]; // Can be 1, 2, 3, 4, 5, 6, 7, 8, 9, or all 10 dimensions!
  pricing: {
    ebook: number;
    audiobook: number;
    videobook: number;
    manuscript: number;
    hardcover?: number;
    papercover?: number;
    pendrive_sd?: number;
    musical_album?: number;
    silk_cotton?: number;
    digital_device?: number;
  };
  files: {
    ebook: File | null;
    audiobook: File | null;
    videobook: File | null;
    manuscript: File | null; // Raw handwritten scans/notebook
    hardcover?: File | null;
    papercover?: File | null;
    pendrive_sd?: File | null;
    musical_album?: File | null;
    silk_cotton?: File | null;
    digital_device?: File | null;
  };
  manuscriptSpecs?: {
    notebookType: string;
    penMedium: string;
    pageCount: number;
    sampleScanUrl: string;
  };
  hardcoverSpecs?: {
    binding: string;
    foilStamping: string;
    ribbonColor: string;
  };
  papercoverSpecs?: {
    paperStock: string;
    finish: string;
    dimensions: string;
  };
  pendriveSpecs?: {
    capacity: string;
    casing: string;
  };
  musicalAlbumSpecs?: {
    albumTitle: string;
    composer: string;
    genre: string;
  };
  silkCottonSpecs?: {
    material: string;
    binding: string;
    editionUnits: number;
  };
  digitalDeviceSpecs?: {
    deviceName: string;
    screenTech: string;
    casing: string;
  };
  chapterOnePreview?: ChapterPreview;
  handwrittenDraftNotes?: string;
  musicalAlbumTrackCount?: number;
}

export interface ApiAccessRequest {
  bookId: string;
  format: FormatType;
  isSampleOnly: boolean;
  userId?: string;
  authToken?: string;
}

export interface ApiAccessResponse {
  success: boolean;
  bookId: string;
  format: FormatType;
  isSampleOnly: boolean;
  signedUrl: string;
  expiresInSeconds: number;
  expiresAt: string;
  storageProvider: 'Cloudflare R2' | 'AWS S3' | 'Google Drive Native Vault';
  signatureAlgorithm: 'HMAC-SHA256';
  tokenSignature: string;
  userAuthorized: boolean;
  message?: string;
  driveFileId?: string;
}

export interface Review {
  id: string;
  bookId: string;
  author?: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment?: string;
  content?: string;
  date: string;
  formatPurchased: FormatType;
  verifiedPurchase: boolean;
  helpfulVotes?: number;
  helpfulCount?: number;
}

export interface ReelComment {
  id: string;
  userName: string;
  userRole: 'Author' | 'Verified Reader' | 'Book Critic' | 'Book Club Host' | 'Reviewer' | 'Visitor';
  avatar?: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface ReelVideo {
  id: string;
  bookId?: string;
  bookTitle: string;
  authorName?: string;
  creatorName: string;
  creatorRole: 'Author' | 'Verified Reader' | 'Book Critic' | 'Critic & Reviewer' | 'Book Club' | 'Book Club Host' | 'Reviewer' | 'Visitor' | 'Reader' | 'Book Lover';
  creatorAvatar?: string;
  title?: string;
  caption: string;
  category?: 'Author Reading' | 'Reader Reaction' | 'Critic Review' | 'Book Club' | 'Silk & Cotton Unboxing' | 'Dedicated Device Demo' | 'Soundtrack Experience' | string;
  dimensionTag?: string;
  tags?: string[];
  videoUrl: string;
  thumbnailUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  uploadedAt: string;
  comments: ReelComment[];
}

export type AuthProviderType = 'google' | 'email' | 'apple' | 'facebook' | 'twitter';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: AuthProviderType;
  role: 'author' | 'reader' | 'publisher' | 'critic';
  createdAt: string;
  isAnonymous?: boolean;
}

export interface BlogMediaItem {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'document' | 'archive';
  url: string;
  sizeBytes: number;
  sizeFormatted: string; // e.g. "4.2 GB", "850 MB"
  mimeType: string;
  uploadedAt: string;
  caption?: string;
  durationSeconds?: number;
}

export interface BlogComment {
  id: string;
  author: string;
  authorRole?: string;
  text: string;
  date: string;
  likes: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  authorRole: 'Author' | 'Reader' | 'Book Critic' | 'Literary Scholar' | 'Visitor';
  authorAvatar?: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  featuredBookId?: string;
  comments: BlogComment[];
  mediaItems?: BlogMediaItem[];
  media?: BlogMediaItem[];
  isAutoGenerated?: boolean;
  editionCycle?: number;
  seoKeywords?: string[];
  globalSources?: string[];
  coverImagePrompt?: string;
  coverImageAlt?: string;
}

export interface BlogAiSuggestions {
  title: string;
  subtitle: string;
  category: 'Craft & Writing' | '10 Dimensions & Hardware' | 'Book Reviews' | 'Publishing Industry' | 'Reader Essays' | 'Interviews';
  suggestedExcerpt: string;
  articleContent: string;
  suggestedTags: string[];
  suggestedMediaCaption?: string;
  seoKeywords: string[];
}

export interface AiPublishPlan {
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  category: string;
  description: string;
  isbn: string;
  pages: number;
  pricing: Record<FormatType, number>;
  manuscriptSpecs: {
    medium: string;
    notebookType: string;
    fountainPenDetails: string;
    scannedDpi: number;
    notes: string;
  };
  hardcoverSpecs: {
    paperWeightGsm: number;
    bindingType: string;
    clothColor: string;
    foilStampingColor: string;
  };
  papercoverSpecs: {
    trimSize: string;
    paperType: string;
    matteFinish: boolean;
  };
  pendriveSdSpecs: {
    capacityGb: number;
    formatSystem: string;
    bonusArchivesIncluded: string[];
  };
  musicalAlbumSpecs: {
    albumTitle: string;
    composer: string;
    genre: string;
    trackList: string[];
  };
  silkCottonSpecs: {
    material: string;
    binding: string;
    editionUnits: number;
    threadCount?: string;
  };
  digitalDeviceSpecs: {
    deviceName: string;
    screenTech: string;
    casing: string;
    preloadedDimensionsCount: number;
    batteryLife?: string;
  };
  marketingHooks: string[];
  seoKeywords: string[];
  readinessCheck: {
    score: number;
    itemsReady: number;
    totalItems: number;
    checklist: { name: string; ready: boolean; hint: string }[];
  };
}

export interface WaitlistEntry {
  id: string;
  fullName: string;
  contact: string; // WhatsApp number or email
  bookId: string;
  bookTitle: string;
  authorName: string;
  dimension: 'digital_device' | 'manuscript' | 'musical_album' | 'silk_cotton' | 'dedicated_tablet_all9';
  dimensionLabel: string;
  notes?: string;
  joinedAt: string;
  priorityQueueNumber: number;
  status: 'confirmed' | 'priority' | 'contacted';
}

export interface ReadingProgress {
  bookId: string;
  format: FormatType;
  currentPage: number;
  totalPages: number;
  percentCompleted: number;
  lastReadAt: string;
  timeSpentMinutes: number;
  bookmarks: number[];
  notes?: string;
}

export type PaymentGatewayId = 
  | 'stripe' 
  | 'paypal' 
  | 'razorpay' 
  | 'paystack' 
  | 'flutterwave' 
  | 'mpesa' 
  | 'alipay' 
  | 'crypto';

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  name: string;
  provider: string;
  enabled: boolean;
  currency: string;
  supportedCurrencies: string[];
  accountIdentifier: string;
  apiKeyOrSecret: string;
  webhookActive: boolean;
  feePercentage: number;
  payoutSpeed: string;
  badge: string;
  region: string;
  description: string;
  testMode?: boolean;
}

export interface AuthorYouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'All Videos' | 'Book Trailers' | 'Behind The Scenes' | 'Masterclasses' | 'Audiobook Excerpts' | '10 Dimensions' | 'Podcasts';
  views: string;
  uploadDate: string;
  featured?: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  category?: string;
}

export interface StripePayoutTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'in_transit' | 'failed';
  arrivalDate: string;
  createdDate: string;
  destinationBank: string;
  method: 'standard_ach' | 'instant_card' | 'sepa' | 'wire' | 'momo';
  description: string;
  feeAmount: number;
  netAmount: number;
}

export interface StripeConnectAccount {
  id: string;
  authorId: string;
  accountId: string; // e.g. "acct_1Nv... "
  accountType: 'express' | 'standard' | 'custom';
  country: string; // e.g. 'US', 'GH', 'GB', 'NG', 'CA', 'DE', 'KE', 'ZA'
  countryName: string;
  defaultCurrency: string; // 'USD', 'GHS', 'EUR', 'GBP', 'CAD', 'NGN'
  businessType: 'individual' | 'company' | 'non_profit';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  email: string;
  businessProfileName: string;
  supportPhone?: string;
  payoutSchedule: {
    interval: 'daily' | 'weekly' | 'monthly' | 'manual';
    delayDays: number;
    weeklyAnchor?: string; // e.g. 'friday'
    monthlyAnchor?: number; // e.g. 1
  };
  payoutBank: {
    bankName: string;
    last4: string;
    routingNumber?: string;
    currency: string;
    status: 'verified' | 'pending' | 'action_required';
  };
  balances: {
    available: number;
    pending: number;
    currency: string;
    lifetimePaidOut: number;
    lastPayoutAmount: number;
    lastPayoutDate: string;
    nextPayoutDate: string;
  };
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
  };
  transactions: StripePayoutTransaction[];
  livemode: boolean;
  connectedAt: string;
  dashboardLoginLink?: string;
}

export interface AiVoiceSearchResult {
  recognizedIntent: 'filter_format' | 'search_topic' | 'author_query' | 'price_filter' | 'dimension_inquiry' | 'general';
  cleanSearchQuery: string;
  detectedFormat?: FormatType | 'all';
  detectedDimensionNumber?: number;
  detectedCategory?: string;
  maxPrice?: number;
  detectedAuthor?: string;
  voiceAnswerSummary: string;
  matchingBookIds: string[];
  suggestedFollowUps: string[];
  confidenceScore: number;
}

export interface AudioBookmark {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCoverImage: string;
  author: string;
  timestampSeconds: number;
  formattedTimestamp: string;
  chapterTitle?: string;
  note: string;
  colorTag?: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  createdAt: string;
  userId?: string;
}

export interface PredictiveSearchBookItem {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  category: string;
  coverImage: string;
  rating: number;
  price: number;
  formats: FormatType[];
}

export interface PredictiveSearchAuthorItem {
  id: string;
  name: string;
  bookCount: number;
  primaryCategory: string;
  sampleCoverImage?: string;
}

export interface PredictiveSearchGenreItem {
  id: string;
  name: string;
  bookCount: number;
  iconName?: string;
}

export interface PredictiveSuggestions {
  books: PredictiveSearchBookItem[];
  authors: PredictiveSearchAuthorItem[];
  genres: PredictiveSearchGenreItem[];
  popularQueries: string[];
  totalMatches: number;
}

export interface WishlistToastState {
  id: string;
  type: 'added' | 'removed';
  book: Book;
  itemCount: number;
}

