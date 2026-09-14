import { ReelVideo } from '../types';

export const INITIAL_REELS: ReelVideo[] = [
  {
    id: 'reel-1',
    bookId: 'book-1',
    bookTitle: 'The Sovereign Architect',
    authorName: 'Johnny Blue',
    creatorName: 'Johnny Blue',
    creatorRole: 'Author',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Why I Created All 10 Dimensions of The Sovereign Architect',
    caption: 'From handwritten fountain pen notebooks to artisanal handloom silk bindings and a custom standalone E-Ink reading slab. Literature deserves more than flat glass. #10Dimensions #Johnnyblue1 #AuthorLife',
    category: 'Author Reading',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-vintage-book-and-turning-pages-41228-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    likesCount: 1420,
    commentsCount: 184,
    sharesCount: 395,
    isLiked: true,
    isBookmarked: false,
    uploadedAt: '2 hours ago',
    comments: [
      {
        id: 'c1',
        userName: 'Aria Chen',
        userRole: 'Verified Reader',
        text: 'The Silk & Cotton edition feels like holding an ancient heirloom! Absolutely stunning craftsmanship.',
        timestamp: '1 hour ago',
        likes: 42
      },
      {
        id: 'c2',
        userName: 'London Literary Circle',
        userRole: 'Book Club Host',
        text: 'We listened to the orchestral soundtrack while reading Chapter 4. Transcendent experience!',
        timestamp: '45 mins ago',
        likes: 29
      }
    ]
  },
  {
    id: 'reel-2',
    bookId: 'book-1',
    bookTitle: 'The Sovereign Architect',
    authorName: 'Johnny Blue',
    creatorName: 'Clara Oswald',
    creatorRole: 'Book Critic',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    title: 'Unboxing the Dedicated Digital E-Ink Device (Dimension 10)',
    caption: 'No notifications. No social media distractors. Just 300 PPI color e-paper with all 9 other dimensions preloaded inside a matte titanium spine. Is this the future of reading hardware? #EInk #TechReview #BookTok',
    category: 'Dedicated Device Demo',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-reading-on-a-digital-tablet-device-41398-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    likesCount: 3890,
    commentsCount: 420,
    sharesCount: 910,
    isLiked: false,
    isBookmarked: true,
    uploadedAt: '5 hours ago',
    comments: [
      {
        id: 'c3',
        userName: 'Marcus Sterling',
        userRole: 'Author',
        text: 'The matte finish on the bezel was specifically calibrated to match the feel of cold linen paper.',
        timestamp: '3 hours ago',
        likes: 67
      }
    ]
  },
  {
    id: 'reel-3',
    bookId: 'book-2',
    bookTitle: 'Chronicles of the Astral Gate',
    authorName: 'Eleanor Vance',
    creatorName: 'The Midnight Book Club',
    creatorRole: 'Book Club Host',
    creatorAvatar: 'https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?auto=format&fit=crop&q=80&w=200',
    title: 'Our Book Club Reacts to the 4K Cinematic Video Chapters!',
    caption: 'We hooked up the 4K Video Book format to the projector for our weekly book club. Watching the space battles with the narrator\'s cinematic voice changed book club night forever! #BookClub #SciFi #BookTok',
    category: 'Book Club',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-sitting-on-a-couch-reading-and-talking-41235-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    likesCount: 2150,
    commentsCount: 168,
    sharesCount: 540,
    isLiked: false,
    isBookmarked: false,
    uploadedAt: '1 day ago',
    comments: [
      {
        id: 'c4',
        userName: 'David K.',
        userRole: 'Verified Reader',
        text: 'Chapter 7 video sequence had me holding my breath. Amazing multi-sensory storytelling.',
        timestamp: '18 hours ago',
        likes: 19
      }
    ]
  },
  {
    id: 'reel-4',
    bookId: 'book-3',
    bookTitle: 'The Alchemist\'s Garden',
    authorName: 'Julian Vance',
    creatorName: 'Matteo Rossi',
    creatorRole: 'Verified Reader',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Touching the Organic Khadi Silk & Mulberry Bookmark (Dimension 9)',
    caption: 'You can actually smell the botanical dyes on this handloom silk edition. Look at the raw coptic stitching. This isn\'t mass manufactured print-on-demand; it\'s fine art. #SilkAndCotton #ArtisanBooks #BookLover',
    category: 'Silk & Cotton Unboxing',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-flipping-pages-of-a-leather-bound-book-41227-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    likesCount: 4720,
    commentsCount: 312,
    sharesCount: 1102,
    isLiked: true,
    isBookmarked: true,
    uploadedAt: '2 days ago',
    comments: [
      {
        id: 'c5',
        userName: 'Sophie Martin',
        userRole: 'Book Critic',
        text: 'The tactile dimension is something digital readers have missed for decades. Bravo Knowledge Centa.',
        timestamp: '1 day ago',
        likes: 54
      }
    ]
  },
  {
    id: 'reel-5',
    bookId: 'book-4',
    bookTitle: 'Neural Symphony',
    authorName: 'Dr. Aris Thorne',
    creatorName: 'The Harsh Literary Critic',
    creatorRole: 'Book Critic',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    title: 'Raw Handwritten Manuscript Scans: Gimmick or True Insight?',
    caption: 'I went through all 340 scanned notebook pages of Neural Symphony with the author\'s crossed-out paragraphs and coffee stains. Here is my completely honest review. #HonestReview #ManuscriptVault #Critic',
    category: 'Critic Review',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-hands-writing-with-a-fountain-pen-41229-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    likesCount: 5890,
    commentsCount: 680,
    sharesCount: 1420,
    isLiked: false,
    isBookmarked: false,
    uploadedAt: '3 days ago',
    comments: [
      {
        id: 'c6',
        userName: 'Elena Rostova',
        userRole: 'Visitor',
        text: 'Seeing the original draft where the main character was completely different gave me chills!',
        timestamp: '2 days ago',
        likes: 88
      }
    ]
  },
  {
    id: 'reel-6',
    bookId: 'book-1',
    bookTitle: 'The Sovereign Architect',
    authorName: 'Johnny Blue',
    creatorName: 'Soundtrack Studio Lab',
    creatorRole: 'Author',
    creatorAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200',
    title: 'Listen with Headphones: Chapter 1 Neo-Classical Theme',
    caption: 'Every book on Knowledge Centa can have an original score. Close your eyes and listen to track 1 "The Architect\'s Blueprint" recorded with an 18-piece chamber orchestra. #BookSoundtrack #AudioDimension #OriginalScore',
    category: 'Soundtrack Experience',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sound-producer-working-on-his-computer-at-night-42171-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    likesCount: 6240,
    commentsCount: 512,
    sharesCount: 1840,
    isLiked: true,
    isBookmarked: true,
    uploadedAt: '4 days ago',
    comments: [
      {
        id: 'c7',
        userName: 'Liam Vance',
        userRole: 'Verified Reader',
        text: 'Purchased the Musical Album along with the Paper Cover. Best literary companion ever created.',
        timestamp: '3 days ago',
        likes: 72
      }
    ]
  }
];
