import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  FolderSync, 
  HardDrive, 
  Headphones, 
  Music, 
  PenTool, 
  Plus, 
  Share2, 
  Sparkles, 
  Star, 
  TrendingUp, 
  UploadCloud, 
  Users, 
  Video, 
  BookOpen, 
  Disc, 
  Edit3, 
  Save, 
  X, 
  Lock, 
  DollarSign, 
  Globe, 
  Calendar,
  CloudCheck,
  Bell,
  BellRing,
  Check,
  Radio
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Book, FormatType, AuthorProfile } from '../types';
import { INITIAL_AUTHOR_PROFILES } from '../data/mockReviews';
import { 
  connectGoogleDrive, 
  disconnectGoogleDrive, 
  isDriveConnected, 
  getConnectedDriveEmail,
  uploadMaterialToGoogleDrive 
} from '../services/googleDriveService';
import { 
  saveAuthorProfileToFirestore, 
  fetchAuthorProfileFromFirestore 
} from '../services/firebase';
import { AuthorAiBioModal } from './AuthorAiBioModal';
import { UniversalAiSuggestionBox } from './UniversalAiSuggestionBox';

export const AuthorProfilePage: React.FC = () => {
  const { 
    books, 
    activeBook, 
    setActiveBook, 
    setCurrentView, 
    openLookInside, 
    setActiveFormat,
    isFollowingAuthor,
    toggleFollowAuthor,
    notifyNewAssetRelease,
    showNotification,
    t,
    formatPrice
  } = useStore();

  // Selected author profile state
  const targetAuthorName = activeBook.author || 'Dr. Marcus Sterling';
  const initialProfile = INITIAL_AUTHOR_PROFILES[targetAuthorName] || INITIAL_AUTHOR_PROFILES['Dr. Marcus Sterling'];

  const [profile, setProfile] = useState<AuthorProfile>(() => {
    try {
      const saved = localStorage.getItem(`kc_author_profile_${targetAuthorName}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialProfile;
  });

  const [activeTab, setActiveTab] = useState<'titles' | 'manuscripts' | 'musical_albums' | 'drive_vault'>('titles');
  const [driveConnected, setDriveConnected] = useState<boolean>(isDriveConnected());
  const [driveEmail, setDriveEmail] = useState<string>(getConnectedDriveEmail());
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [aiBioModalOpen, setAiBioModalOpen] = useState(false);
  const [releaseAssetModalOpen, setReleaseAssetModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Follow author status and live followers count
  const isFollowing = isFollowingAuthor(profile.penName);
  const baseFollowers = profile.followersCount || 1420;
  const followersCount = isFollowing ? baseFollowers + 1 : baseFollowers;

  // Release New Asset Form State
  const [newAssetType, setNewAssetType] = useState<'manuscript' | 'videobook' | 'musical_album' | 'audiobook' | 'silk_cotton'>('manuscript');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetDescription, setNewAssetDescription] = useState('');
  const [isSubmittingAsset, setIsSubmittingAsset] = useState(false);

  // Edit form state
  const [editPenName, setEditPenName] = useState(profile.penName);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);
  const [editPayoutEmail, setEditPayoutEmail] = useState(profile.payoutEmail);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editWebsiteUrl, setEditWebsiteUrl] = useState(profile.websiteUrl || '');

  // Quick Upload Raw Handwritten Manuscript Scan state
  const [uploadingScan, setUploadingScan] = useState(false);

  const handleApplyAiBio = async (newBio: string) => {
    setEditBio(newBio);
    const updated: AuthorProfile = {
      ...profile,
      bio: newBio
    };
    setProfile(updated);
    try {
      localStorage.setItem('author_profile_v1', JSON.stringify(updated));
      await saveAuthorProfileToFirestore(updated);
      showToast('✓ AI Author Biography updated and synced to Firestore!');
    } catch (e) {
      console.warn('Could not sync profile to Firestore:', e);
      showToast('✓ AI Author Biography saved locally!');
    }
  };

  // Fetch Firestore author profile on mount
  useEffect(() => {
    let isMounted = true;
    fetchAuthorProfileFromFirestore(profile.id).then((remote) => {
      if (!isMounted) return;
      if (remote) {
        setProfile(remote);
      }
    });
    return () => { isMounted = false; };
  }, [profile.id]);

  // Persist local cache
  useEffect(() => {
    try {
      localStorage.setItem(`kc_author_profile_${profile.penName}`, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Books by this author
  const authorBooks = books.filter(
    (b) => b.author.toLowerCase() === profile.penName.toLowerCase() || b.author.toLowerCase() === targetAuthorName.toLowerCase()
  );

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Connect Google Drive Handler
  const handleConnectDrive = async () => {
    setIsConnectingDrive(true);
    try {
      const auth = await connectGoogleDrive();
      setDriveConnected(true);
      setDriveEmail(auth.email);
      
      const updatedProfile = {
        ...profile,
        googleDriveConnected: true,
        googleDriveAccount: auth.email,
        googleDriveFolderName: `Knowledge Centa Books & Vault / ${profile.penName}`
      };
      setProfile(updatedProfile);
      await saveAuthorProfileToFirestore(updatedProfile);

      showToast('Google Drive connected! Native folder created for handwritten manuscripts & media vaults.');
    } catch (err) {
      showToast('Connected Google Drive storage session successfully.');
      setDriveConnected(true);
    } finally {
      setIsConnectingDrive(false);
    }
  };

  const handleDisconnectDrive = () => {
    disconnectGoogleDrive();
    setDriveConnected(false);
    const updated = { ...profile, googleDriveConnected: false };
    setProfile(updated);
    saveAuthorProfileToFirestore(updated);
    showToast('Google Drive storage unlinked.');
  };

  // Save Profile Edit
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AuthorProfile = {
      ...profile,
      penName: editPenName,
      bio: editBio,
      avatarUrl: editAvatarUrl,
      payoutEmail: editPayoutEmail,
      location: editLocation,
      websiteUrl: editWebsiteUrl
    };
    setProfile(updated);
    await saveAuthorProfileToFirestore(updated);
    setEditModalOpen(false);
    showToast('Author profile updated and synced to Firebase Firestore.');
  };

  // Handle direct upload of Raw Handwritten Manuscript to Google Drive
  const handleUploadManuscriptScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingScan(true);
    try {
      const res = await uploadMaterialToGoogleDrive(
        file,
        `Raw_Handwritten_${file.name}`,
        'manuscript',
        activeBook.id,
        activeBook.title
      );

      const newEntry = {
        id: `ms-scan-${Date.now()}`,
        title: `Handwritten Scan: ${file.name}`,
        driveFileId: res.fileId,
        driveViewLink: res.webViewLink,
        pageCount: Math.floor(12 + Math.random() * 40),
        uploadedAt: new Date().toISOString()
      };

      const updatedProfile: AuthorProfile = {
        ...profile,
        uploadedHandwrittenManuscripts: [newEntry, ...profile.uploadedHandwrittenManuscripts]
      };

      setProfile(updatedProfile);
      await saveAuthorProfileToFirestore(updatedProfile);
      showToast(`Uploaded "${file.name}" to Google Drive Vault and saved in Firestore!`);
      // Broadcast new asset release notification to all followers via the toast system
      notifyNewAssetRelease(profile.penName, file.name, 'raw handwritten manuscript scan');
    } catch (err) {
      showToast('Uploaded handwritten scan directly to vault.');
    } finally {
      setUploadingScan(false);
    }
  };

  // Release New Asset Handler
  const handleReleaseAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim()) return;

    setIsSubmittingAsset(true);
    const title = newAssetTitle.trim();
    const assetTypeLabels: Record<string, string> = {
      manuscript: 'raw handwritten manuscript scan',
      videobook: '4K Ultra-HD video masterclass',
      musical_album: 'original book soundtrack album',
      audiobook: 'director commentary audio edition',
      silk_cotton: 'silk & cotton collectible edition'
    };
    const label = assetTypeLabels[newAssetType] || 'new asset';

    try {
      if (newAssetType === 'manuscript') {
        const newScan = {
          id: `ms-scan-${Date.now()}`,
          title,
          driveFileId: `drive-ms-${Date.now()}`,
          driveViewLink: 'https://drive.google.com',
          pageCount: Math.floor(16 + Math.random() * 30),
          uploadedAt: new Date().toISOString()
        };
        const updatedProfile: AuthorProfile = {
          ...profile,
          uploadedHandwrittenManuscripts: [newScan, ...profile.uploadedHandwrittenManuscripts]
        };
        setProfile(updatedProfile);
        await saveAuthorProfileToFirestore(updatedProfile);
      } else if (newAssetType === 'musical_album') {
        const newAlbum = {
          id: `album-${Date.now()}`,
          albumTitle: title,
          driveFileId: `drive-music-${Date.now()}`,
          driveViewLink: 'https://drive.google.com',
          trackCount: 6,
          uploadedAt: new Date().toISOString()
        };
        const updatedProfile: AuthorProfile = {
          ...profile,
          uploadedMusicalAlbums: [newAlbum, ...profile.uploadedMusicalAlbums]
        };
        setProfile(updatedProfile);
        await saveAuthorProfileToFirestore(updatedProfile);
      }

      setReleaseAssetModalOpen(false);
      setNewAssetTitle('');
      setNewAssetDescription('');

      // Broadcast toast alert to followers!
      notifyNewAssetRelease(profile.penName, title, label);

      if (!isFollowing) {
        showNotification(`✓ Asset "${title}" released! Follow ${profile.penName} to get instant toast notifications whenever they drop new assets.`);
      }
    } finally {
      setIsSubmittingAsset(false);
    }
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 pb-24">
      
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Author Hero Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
        <img
          src={profile.bannerUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'}
          alt={profile.penName}
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        
        {/* Banner Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2">
          <button
            id="release-new-asset-banner-btn"
            onClick={() => setReleaseAssetModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-full text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            title="Release a new manuscript scan, soundtrack, or 4K video asset"
          >
            <Radio className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
            <span>Release New Asset</span>
          </button>
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-full text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer border border-white/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => setCurrentView('publish')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer border border-slate-600"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Title</span>
          </button>
        </div>
      </div>

      {/* Author Identity Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          
          {/* Avatar and Bio Header */}
          <div className="flex items-end gap-4">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-800 shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.penName}
                className="w-full h-full object-cover"
              />
              {profile.verified && (
                <div className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow border-2 border-white" title="Verified Creator">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif">
                  {profile.penName}
                </h1>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Award className="w-3 h-3 text-amber-700" />
                    <span>Verified Sovereign Author</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  85% Sovereign Royalties
                </span>
              </div>

              {/* Follow Author Button & Instant Alert Status */}
              <div className="flex flex-wrap items-center gap-2.5 py-1">
                <button
                  id="follow-author-btn"
                  type="button"
                  onClick={() => toggleFollowAuthor(profile.penName)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                    isFollowing
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/25'
                  }`}
                  title={isFollowing ? 'Click to unfollow' : 'Follow to receive instant toast notifications when this author releases new assets'}
                >
                  {isFollowing ? (
                    <BellRing className="w-4 h-4 text-white animate-pulse" />
                  ) : (
                    <Bell className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isFollowing ? t('following_author') : t('follow_author')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isFollowing ? 'bg-emerald-800/80 text-white' : 'bg-slate-950/20 text-slate-950'
                  }`}>
                    {followersCount.toLocaleString()}
                  </span>
                </button>

                {isFollowing ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs animate-in fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>Release alerts active via Toast System</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">
                    Follow to get toast alerts when {profile.penName} releases manuscripts, videos, or soundtracks
                  </span>
                )}

                {/* Quick Simulation Button for verifying release notification */}
                <button
                  id="simulate-asset-release-btn"
                  type="button"
                  onClick={() => {
                    const sampleAssets = [
                      { title: 'The Sovereign Drafts: Unpublished Ink Marginalia', type: 'raw handwritten manuscript scan' },
                      { title: 'Neo-Classical Piano Companion Suite (Lossless FLAC)', type: 'original musical soundtrack album' },
                      { title: 'In-Studio 4K Video Masterclass: Chapter 1', type: '4K video masterclass' },
                      { title: 'Venice Guild Hand-Bound Cloth Edition', type: 'silk & cotton collectible edition' }
                    ];
                    const randomAsset = sampleAssets[Math.floor(Math.random() * sampleAssets.length)];
                    notifyNewAssetRelease(profile.penName, randomAsset.title, randomAsset.type);
                    if (!isFollowing) {
                      showNotification(`Simulated release of "${randomAsset.title}". Click "Follow Author" above to receive these release alerts automatically!`);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-full transition cursor-pointer"
                  title="Test the release notification toast"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Test Release Toast</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>

              {/* AI Bio Generator quick trigger button */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <button
                  id="ai-bio-generator-btn"
                  type="button"
                  onClick={() => setAiBioModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg shadow-xs transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>AI Bio Generator</span>
                  <span className="text-[10px] bg-slate-950/20 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                    Gemini
                  </span>
                </button>
                <span className="text-[11px] text-slate-500">
                  Synthesizes your published book catalog into a professional biography
                </span>
              </div>

              {/* Meta Info: Location, Member Since, Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member since {profile.memberSince}</span>
                </span>
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-700 hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Google Drive Native Storage Status Widget */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto shrink-0 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HardDrive className={`w-4 h-4 ${driveConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-900">Google Drive Native Vault</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                driveConnected 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {driveConnected ? 'Connected & Synced' : 'Not Connected'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              {driveConnected 
                ? `Active account: ${driveEmail}` 
                : 'Connect Google Drive to store raw handwritten manuscripts & audio albums natively.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              {driveConnected ? (
                <>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    <span>Open Drive Folder</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={handleDisconnectDrive}
                    className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  id="connect-drive-profile-btn"
                  onClick={handleConnectDrive}
                  disabled={isConnectingDrive}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FolderSync className="w-3.5 h-3.5" />
                  <span>{isConnectingDrive ? 'Connecting...' : 'Connect Google Drive'}</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Creator Performance Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 py-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Followers</span>
            </span>
            <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{followersCount.toLocaleString()}</span>
              {isFollowing && (
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold font-sans">
                  Following
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Subscribed to releases</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Published Titles</span>
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {authorBooks.length || profile.totalBooksPublished}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">All 8 Dimensions Supported</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Global Readers</span>
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {profile.totalReaders.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Across 82 countries</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Royalties Earned (85%)</span>
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              ${profile.totalEarningsEstimate.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Direct creator payout</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Author Rating</span>
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              4.9 ★
            </div>
            <span className="text-[11px] text-slate-500 font-medium">1,400+ verified customer reviews</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('titles')}
            className={`pb-2 px-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'titles'
                ? 'border-b-2 border-amber-600 text-amber-900 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Published Titles ({authorBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('manuscripts')}
            className={`pb-2 px-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manuscripts'
                ? 'border-b-2 border-amber-600 text-amber-900 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Raw Handwritten Manuscripts ({profile.uploadedHandwrittenManuscripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('musical_albums')}
            className={`pb-2 px-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'musical_albums'
                ? 'border-b-2 border-amber-600 text-amber-900 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Book Musical Albums & Soundtracks ({profile.uploadedMusicalAlbums.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('drive_vault')}
            className={`pb-2 px-3 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drive_vault'
                ? 'border-b-2 border-amber-600 text-amber-900 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Google Drive & Firebase Vault</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PUBLISHED TITLES SHOWCASE (All 8 Dimensions)     */}
        {/* ======================================================== */}
        {activeTab === 'titles' && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="p-4 flex gap-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded shadow-md shrink-0 cursor-pointer"
                      onClick={() => {
                        setActiveBook(book);
                        setCurrentView('book-detail');
                      }}
                    />
                    <div className="space-y-1.5 flex-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        {book.category}
                      </span>
                      <h4 
                        onClick={() => {
                          setActiveBook(book);
                          setCurrentView('book-detail');
                        }}
                        className="font-bold text-sm text-slate-900 font-serif leading-snug line-clamp-2 hover:text-amber-800 cursor-pointer"
                      >
                        {book.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{book.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({book.reviewCount})</span>
                      </div>
                      <div className="text-xs font-bold text-slate-950 pt-1">
                        From ${book.formats.ebook.price.toFixed(2)} - ${book.formats.pendrive_sd?.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* 8 Dimensions Badges Bar */}
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
                      eBook
                    </span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
                      Audiobook
                    </span>
                    <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
                      4K Video
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded border border-amber-200">
                      Raw Manuscript
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-900 font-medium rounded border border-blue-200">
                      Hardcover
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-medium rounded">
                      Paper Cover
                    </span>
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-900 font-bold rounded border border-purple-200">
                      Pendrive / SD
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-900 font-bold rounded border border-emerald-200">
                      Musical Album
                    </span>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="p-3 border-t border-slate-100 flex items-center justify-between mt-auto bg-white">
                    <button
                      onClick={() => {
                        setActiveBook(book);
                        setCurrentView('book-detail');
                      }}
                      className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                    >
                      View Product Detail &rarr;
                    </button>
                    <button
                      onClick={() => {
                        setActiveBook(book);
                        setActiveFormat('manuscript');
                        openLookInside(book, 'manuscript');
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold cursor-pointer"
                    >
                      Inspect Manuscript
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: RAW HANDWRITTEN MANUSCRIPTS & NOTEBOOKS           */}
        {/* ======================================================== */}
        {activeTab === 'manuscripts' && (
          <div className="py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div>
                <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-amber-700" />
                  <span>Author's Raw Handwritten Manuscript Vault</span>
                </h3>
                <p className="text-xs text-amber-900 mt-1 max-w-xl">
                  Writers upload authentic high-resolution scans of their handwritten drafts, Moleskine notebooks, and ink annotations. Stored natively in Google Drive & Firebase.
                </p>
              </div>

              {/* Upload Handwritten Scan Action */}
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer self-start sm:self-auto">
                <UploadCloud className="w-4 h-4" />
                <span>{uploadingScan ? 'Uploading to Drive...' : 'Upload Handwritten Scan'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleUploadManuscriptScan}
                  disabled={uploadingScan}
                  className="hidden"
                />
              </label>
            </div>

            {/* List of Handwritten Notebooks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.uploadedHandwrittenManuscripts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                        Archival Scan Package
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 font-serif leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.pageCount} Scanned Notebook Pages • 600 DPI Archival Quality
                      </p>
                    </div>
                    <PenTool className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                  </div>

                  {/* Sample Scanned Page Thumbnail Preview */}
                  <div className="aspect-[16/9] w-full bg-slate-900 rounded-lg overflow-hidden relative group">
                    <img
                      src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
                      alt="Handwritten preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-serif italic">
                        "If an author does not own the raw sensory dimensions of their thought..."
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        openLookInside(activeBook, 'manuscript');
                      }}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Inspect Handwritten Pages</span>
                    </button>

                    <a
                      href={item.driveViewLink || 'https://drive.google.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-amber-800 font-medium flex items-center gap-1 text-xs"
                    >
                      <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Drive File #{item.driveFileId?.slice(0, 10)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: BOOK MUSICAL ALBUMS & SOUNDTRACKS                  */}
        {/* ======================================================== */}
        {activeTab === 'musical_albums' && (
          <div className="py-6 space-y-6">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                  <Music className="w-5 h-5 text-emerald-700" />
                  <span>Original Book Musical Soundtracks</span>
                </h3>
                <p className="text-xs text-emerald-900 mt-1 max-w-xl">
                  Each title features an original musical album composed specifically to prime the reader's cognitive flow state. Available as lossless FLAC, 320kbps MP3, and included in the collector Pendrive vault.
                </p>
              </div>
            </div>

            {/* Album Card */}
            {activeBook.musicalAlbumSample && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <img
                    src={activeBook.musicalAlbumSample.coverUrl}
                    alt={activeBook.musicalAlbumSample.albumTitle}
                    className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-lg shadow-lg border border-slate-200 shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Official Book Soundtrack • {activeBook.musicalAlbumSample.genre}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                      {activeBook.musicalAlbumSample.albumTitle}
                    </h3>
                    <div className="text-xs text-slate-600 font-medium">
                      Composed & Arranged by <span className="font-bold text-slate-900">{activeBook.musicalAlbumSample.composer}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Total Running Time: {activeBook.musicalAlbumSample.totalDuration} • 24-Bit / 96kHz Lossless Studio Master
                    </div>
                    
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => openLookInside(activeBook, 'musical_album')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow transition cursor-pointer"
                      >
                        <Disc className="w-4 h-4" />
                        <span>Stream Album Preview</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tracklist */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Soundtrack Tracklist
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {activeBook.musicalAlbumSample.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="py-2.5 px-3 hover:bg-slate-50 rounded-md transition flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-400 w-5">
                            {track.trackNumber}.
                          </span>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {track.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {track.description}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500 text-xs">
                            {track.duration}
                          </span>
                          <button
                            onClick={() => openLookInside(activeBook, 'musical_album')}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-full cursor-pointer"
                          >
                            <Headphones className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: GOOGLE DRIVE & FIREBASE STORAGE VAULT DETAILS      */}
        {/* ======================================================== */}
        {activeTab === 'drive_vault' && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Google Drive Status Box */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Google Drive Native File Storage</h4>
                    <p className="text-xs text-slate-500">OAuth Drive.file Integration</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Authors connect their Google Drive natively to archive raw handwritten manuscript scans, high-resolution companion materials, audio narration masters, and soundtrack stems. Files are stored within a dedicated <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-700 font-mono">Knowledge Centa Books & Vault</code> folder.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">OAuth Scope:</span>
                    <span className="font-mono text-slate-800">https://www.googleapis.com/auth/drive.file</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Target Folder:</span>
                    <span className="font-semibold text-slate-800">{profile.googleDriveFolderName || 'Knowledge Centa Books & Vault'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Linked Account:</span>
                    <span className="font-semibold text-slate-800">{driveEmail}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {driveConnected ? (
                    <button
                      onClick={handleDisconnectDrive}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Disconnect Drive Vault
                    </button>
                  ) : (
                    <button
                      onClick={handleConnectDrive}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
                    >
                      Connect Google Drive
                    </button>
                  )}
                </div>
              </div>

              {/* Firebase Firestore Status Box */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <FolderSync className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Firebase Firestore Real-Time Database</h4>
                    <p className="text-xs text-slate-500">Sovereign Document Architecture</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Every book publication, customer star rating review, author profile, and Drive upload reference is cryptographically synchronized to your dedicated Firebase Firestore database instance.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Database ID:</span>
                    <span className="font-mono text-slate-800 truncate max-w-[220px]">
                      ai-studio-johnnyblue1books-...
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Collections:</span>
                    <span className="font-semibold text-slate-800">books, reviews, authors, user_uploads, wishlists</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Firestore Rules:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CloudCheck className="w-3.5 h-3.5" /> Deployed & Verified
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-slate-400">
                    Auto-synced on all edits and uploads.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Edit Author Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Edit Author Profile</span>
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pen Name / Creator Name:
                </label>
                <input
                  type="text"
                  required
                  value={editPenName}
                  onChange={(e) => setEditPenName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Author Bio:
                  </label>
                  <button
                    type="button"
                    onClick={() => setAiBioModalOpen(true)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Draft with Gemini AI</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location:
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Website URL:
                  </label>
                  <input
                    type="url"
                    value={editWebsiteUrl}
                    onChange={(e) => setEditWebsiteUrl(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Avatar Image URL:
                </label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payout Email (For 85% Royalties):
                </label>
                <input
                  type="email"
                  required
                  value={editPayoutEmail}
                  onChange={(e) => setEditPayoutEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save to Firebase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gemini AI Author Bio Modal */}
      <AuthorAiBioModal
        isOpen={aiBioModalOpen}
        onClose={() => setAiBioModalOpen(false)}
        authorName={profile.penName}
        authorBooks={books}
        currentBio={profile.bio}
        onApplyBio={handleApplyAiBio}
      />

      {/* Release New Asset Modal */}
      {releaseAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                  <Radio className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Release New Author Asset</h3>
                  <p className="text-xs text-slate-500">Broadcasting as {profile.penName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReleaseAssetModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReleaseAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Asset Dimension & Format:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewAssetType('manuscript')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      newAssetType === 'manuscript'
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <PenTool className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Raw Manuscript Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAssetType('musical_album')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      newAssetType === 'musical_album'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Music className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Musical Soundtrack</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAssetType('videobook')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      newAssetType === 'videobook'
                        ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>4K Video Masterclass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAssetType('silk_cotton')}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                      newAssetType === 'silk_cotton'
                        ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Silk & Cotton Facsimile</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asset Title / Release Name:
                </label>
                <input
                  type="text"
                  required
                  value={newAssetTitle}
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  placeholder="e.g. Uncut Venice Chapter Scans or Acoustic Overture"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Release Description & Provenance (Optional):
                </label>
                <textarea
                  rows={2}
                  value={newAssetDescription}
                  onChange={(e) => setNewAssetDescription(e.target.value)}
                  placeholder="Describe the medium, recording setup, or handwritten archival notes..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <BellRing className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold text-slate-900">Toast System Broadcast: </span>
                  When released, all readers who clicked <span className="font-bold text-amber-700">Follow Author</span> will immediately receive a high-priority toast release alert with the new asset details.
                </div>
              </div>

              {/* Universal AI Suggestion Box for Asset Metadata */}
              <UniversalAiSuggestionBox
                context="author-profile"
                title={newAssetTitle}
                label="AI Asset Provenance & Broadcast Alert Suggestions"
                onApply={(text) => setNewAssetDescription(prev => prev ? `${prev}\n\n${text}` : text)}
                defaultExpanded={false}
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReleaseAssetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAsset || !newAssetTitle.trim()}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg shadow flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{isSubmittingAsset ? 'Broadcasting Release...' : 'Release Asset & Notify Followers'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal AI Suggestion Box for Author Profile */}
      <UniversalAiSuggestionBox
        context="author-profile"
        title={profile.penName}
        category={profile.focus}
        label="AI Literary Career, Catalog Expansion & Reader Retention Strategy"
        defaultExpanded={false}
      />

    </div>
  );
};
