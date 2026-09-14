import { AuthorYouTubeVideo } from '../types';

export const AUTHOR_YOUTUBE_CHANNEL = {
  channelName: 'Johnnyblue1 Books & Media Lab',
  handle: '@JohnnyBlueMedia',
  subscriberCount: '148K subscribers',
  videoCount: '92 videos',
  verified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
  description: 'Welcome to the official studio channel of Johnny Blue. Exploring the architecture of sovereign intellectual capital, 10-dimension book crafting, raw manuscript penmanship, and ambient neo-classical book scoring.',
  customUrl: 'https://youtube.com/@JohnnyBlueMedia'
};

export const INITIAL_YOUTUBE_VIDEOS: AuthorYouTubeVideo[] = [
  {
    id: 'yt-1',
    youtubeId: 'jfKfPfyJRdk', // Lofi / ambient studio audio stream
    title: 'The Sovereign Architect: Deep Focus Writing & Composing Studio (Live Soundscape)',
    description: 'Immerse yourself in the ambient neo-classical and electronic modular synthesizer soundscapes composed alongside the manuscript of The Sovereign Architect.',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    duration: '24:18',
    category: 'Masterclasses',
    views: '84.2K views',
    uploadDate: '2 weeks ago',
    featured: true
  },
  {
    id: 'yt-2',
    youtubeId: '5qap5aO4i9A',
    title: 'Why I Created 10 Dimensions for Every Book: From Raw Ink to Silk & Dedicated E-Ink Tablets',
    description: 'An in-depth breakdown of our 10 publishing dimensions: how we package raw handwritten fountain pen scans, Smyth-sewn clothbound hardcovers, USB metal keys, and dedicated hardware devices.',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    duration: '18:42',
    category: '10 Dimensions',
    views: '129.5K views',
    uploadDate: '1 month ago',
    featured: true
  },
  {
    id: 'yt-3',
    youtubeId: 'M7lc1UVf-VE',
    title: 'The Sovereign Architect: Official 4K Cinematic Book Trailer',
    description: 'Witness the visionary world of distributed media fortresses, Cloudflare R2 signed pipelines, and creative intellectual sovereignty.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    duration: '03:15',
    category: 'Book Trailers',
    views: '240.1K views',
    uploadDate: '2 months ago',
    featured: false
  },
  {
    id: 'yt-4',
    youtubeId: '2OEL4P1Rz04',
    title: 'Composing the Neo-Classical Orchestral Score for "The Sovereign Architect"',
    description: 'Behind-the-scenes recording session in Prague and London tracking live strings and vintage analog synthesizers for the book soundtrack album.',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    duration: '14:20',
    category: 'Behind The Scenes',
    views: '46.7K views',
    uploadDate: '3 months ago',
    featured: false
  },
  {
    id: 'yt-5',
    youtubeId: '7e90gBu4pas',
    title: 'Audiobook Chapter 1: The Fortress Architecture of Modern Storytellers (Full Unabridged Sample)',
    description: 'Listen to the complete introductory chapter of The Sovereign Architect narrated by Johnny Blue and studio voice actors.',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    duration: '32:05',
    category: 'Audiobook Excerpts',
    views: '98.3K views',
    uploadDate: '3 months ago',
    featured: false
  },
  {
    id: 'yt-6',
    youtubeId: 'jfKfPfyJRdk',
    title: 'Handloom Artisans: Weaving Mulberry Silk & Raw Khadi Cotton for the Limited Edition Books',
    description: 'Documentary short following the artisan master weavers creating the 500 numbered handloom silk & cotton edition tomes.',
    thumbnail: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    duration: '11:45',
    category: 'Behind The Scenes',
    views: '35.8K views',
    uploadDate: '4 months ago',
    featured: false
  },
  {
    id: 'yt-7',
    youtubeId: '5qap5aO4i9A',
    title: 'The Future of Independent Publishing: Global Royalties & Instant Multicurrency Payouts',
    description: 'Podcast session discussing how authors can eliminate middlemen and collect global payments via Stripe, Razorpay, M-Pesa, Paystack, and Solana USDC.',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    duration: '42:10',
    category: 'Podcasts',
    views: '71.4K views',
    uploadDate: '5 months ago',
    featured: false
  }
];
