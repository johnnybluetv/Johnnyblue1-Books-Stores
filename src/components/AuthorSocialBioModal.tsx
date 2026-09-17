import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Instagram, 
  Youtube, 
  Facebook, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Globe, 
  Calendar, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Music, 
  Radio, 
  BellRing, 
  Check, 
  Share2,
  GraduationCap,
  Feather,
  Languages
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getAuthorSocialAndBioData } from '../data/authorSocialData';

interface AuthorSocialBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName?: string | null;
}

export const AuthorSocialBioModal: React.FC<AuthorSocialBioModalProps> = ({
  isOpen,
  onClose,
  authorName
}) => {
  const { 
    isFollowingSocial, 
    toggleFollowSocial, 
    followAllSocials, 
    unfollowAllSocials, 
    getAuthorFollowedSocialCount,
    books,
    setActiveBook,
    setCurrentView
  } = useStore();

  const [activeTab, setActiveTab] = useState<'social' | 'bio' | 'all'>('all');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAuthorName = authorName || 'Dr. Marcus Sterling';
  const authorData = getAuthorSocialAndBioData(currentAuthorName);
  const { socialHandles, bioData, avatarUrl, bannerUrl } = authorData;

  const followedCount = getAuthorFollowedSocialCount(currentAuthorName);
  const allFollowed = followedCount === 6;

  const handleCopyHandle = (handle: string, label: string) => {
    navigator.clipboard?.writeText(handle);
    setCopySuccess(`Copied ${label} (${handle})`);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const handleNavigateToBook = (title: string) => {
    const found = books.find((b) => b.title.toLowerCase().includes(title.toLowerCase()));
    if (found) {
      setActiveBook(found);
      setCurrentView('product-detail');
      onClose();
    }
  };

  const socialChannels = [
    {
      id: 'instagram',
      name: 'Instagram Profile',
      handle: socialHandles.instagram,
      url: socialHandles.instagramUrl,
      metric: socialHandles.instagramFollowers ? `${socialHandles.instagramFollowers} Followers` : 'Active Literary Feed',
      action: 'follow',
      icon: Instagram,
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      btnActiveBg: 'bg-rose-600 hover:bg-rose-700 text-white'
    },
    {
      id: 'tiktok',
      name: 'TikTok Handle',
      handle: socialHandles.tiktok,
      url: socialHandles.tiktokUrl,
      metric: socialHandles.tiktokFollowers ? `${socialHandles.tiktokFollowers} Followers` : 'BookTok Short Insights',
      action: 'follow',
      icon: Music,
      gradient: 'from-cyan-500 via-slate-900 to-rose-500',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      btnActiveBg: 'bg-slate-900 hover:bg-slate-800 text-white'
    },
    {
      id: 'youtube',
      name: 'YouTube Channel',
      handle: socialHandles.youtube,
      url: socialHandles.youtubeUrl,
      metric: socialHandles.youtubeSubscribers ? `${socialHandles.youtubeSubscribers} Subscribers` : 'Video Masterclasses',
      action: 'subscribe',
      icon: Youtube,
      gradient: 'from-red-600 to-red-700',
      badgeBg: 'bg-red-50 text-red-700 border-red-200',
      btnActiveBg: 'bg-red-600 hover:bg-red-700 text-white'
    },
    {
      id: 'facebook',
      name: 'Facebook Page / Profile',
      handle: socialHandles.facebook,
      url: socialHandles.facebookUrl,
      metric: socialHandles.facebookFollowers ? `${socialHandles.facebookFollowers} Followers` : 'Reader Community Page',
      action: 'follow',
      icon: Facebook,
      gradient: 'from-blue-600 to-blue-700',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      btnActiveBg: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Page',
      handle: socialHandles.linkedin,
      url: socialHandles.linkedinUrl,
      metric: socialHandles.linkedinFollowers ? `${socialHandles.linkedinFollowers} Connections` : 'Professional Network',
      action: 'follow',
      icon: Linkedin,
      gradient: 'from-sky-700 to-blue-800',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      btnActiveBg: 'bg-sky-700 hover:bg-sky-800 text-white'
    },
    {
      id: 'twitter',
      name: 'X (Twitter) Handle',
      handle: socialHandles.twitter,
      url: socialHandles.twitterUrl,
      metric: socialHandles.twitterFollowers ? `${socialHandles.twitterFollowers} Followers` : 'Real-time Thoughts & Updates',
      action: 'follow',
      icon: Twitter,
      gradient: 'from-zinc-900 to-black',
      badgeBg: 'bg-zinc-100 text-zinc-900 border-zinc-300',
      btnActiveBg: 'bg-black hover:bg-zinc-800 text-white'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner and Identity Header */}
        <div className="relative h-32 sm:h-40 bg-slate-900 shrink-0 overflow-hidden">
          <img 
            src={bannerUrl} 
            alt={bioData.penName}
            className="w-full h-full object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          
          {/* Top Header Actions */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[11px] font-semibold border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Sovereign Creator</span>
            </span>
            <button
              id="close-author-social-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md transition cursor-pointer border border-white/20"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Follow Status Badge on Banner */}
          <div className="absolute bottom-3 right-3 sm:right-4">
            <button
              id="author-modal-follow-all-btn"
              onClick={() => {
                if (allFollowed) {
                  unfollowAllSocials(currentAuthorName);
                } else {
                  followAllSocials(currentAuthorName);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 shadow-md cursor-pointer ${
                allFollowed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-white/50'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950'
              }`}
            >
              {allFollowed ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Following All 6 Channels</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Follow All 6 Channels ({followedCount}/6)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="px-5 sm:px-6 pt-0 pb-3 border-b border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-10 sm:-mt-12 mb-3">
            <div className="flex items-end gap-3.5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xl border-3 border-white bg-slate-800 shrink-0">
                <img 
                  src={avatarUrl} 
                  alt={bioData.penName}
                  className="w-full h-full object-cover" 
                />
                {bioData.verified && (
                  <div className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow border-2 border-white" title="Verified Creator">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                    {bioData.penName}
                  </h2>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold">
                    Author & Sovereign Creator
                  </span>
                </div>
                {bioData.academicTitle && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {bioData.academicTitle}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>{bioData.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>{bioData.totalBooksPublished} Titles</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{bioData.totalReaders.toLocaleString()} Readers</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick in-platform follow summary */}
            <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-1 sm:pt-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>In-Platform Channels:</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
                  {followedCount} / 6 Followed
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Follow without leaving the page
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All (Social & Bio)
            </button>
            <button
              id="author-social-tab-btn"
              onClick={() => setActiveTab('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>6 Social Media Handles</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                6
              </span>
            </button>
            <button
              id="author-bio-tab-btn"
              onClick={() => setActiveTab('bio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bio'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Author Bio-Data</span>
            </button>
          </div>
        </div>

        {/* Copy Feedback Toast */}
        {copySuccess && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-1.5 text-xs flex items-center justify-between animate-in fade-in">
            <span className="font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {copySuccess}
            </span>
            <span className="text-[11px] text-emerald-600">Handle ready to paste</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* TAB 1: 6 SOCIAL MEDIA HANDLES GRID */}
          {(activeTab === 'social' || activeTab === 'all') && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-600" />
                    <span>Official Social Media Handles ({socialChannels.length} Channels)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click <strong>Follow</strong> or <strong>Subscribe</strong> to track {bioData.penName} directly within the platform.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => followAllSocials(currentAuthorName)}
                    className="text-xs text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    + Follow All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => unfollowAllSocials(currentAuthorName)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Unfollow All
                  </button>
                </div>
              </div>

              {/* The 6 Platforms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialChannels.map((channel) => {
                  const Icon = channel.icon;
                  const isFollowing = isFollowingSocial(currentAuthorName, channel.id);
                  const isSubscribe = channel.action === 'subscribe';

                  return (
                    <div 
                      key={channel.id}
                      className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                        isFollowing 
                          ? 'bg-emerald-50/60 border-emerald-300 shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-3">
                          {/* Channel Icon */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs bg-gradient-to-br ${channel.gradient}`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-slate-900">
                                {channel.name}
                              </span>
                              {isFollowing && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  Active
                                </span>
                              )}
                            </div>
                            {/* Handle / Username with Copy */}
                            <button
                              onClick={() => handleCopyHandle(channel.handle, channel.name)}
                              className="text-xs font-mono font-bold text-slate-700 hover:text-amber-700 hover:underline flex items-center gap-1 text-left cursor-pointer"
                              title="Click to copy handle"
                            >
                              <span>{channel.handle}</span>
                            </button>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {channel.metric}
                            </p>
                          </div>
                        </div>

                        {/* Optional external link button */}
                        <a
                          href={channel.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition cursor-pointer"
                          title={`Open ${channel.name} in new tab`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* In-Platform Follow / Subscribe Action Button */}
                      <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">
                          {isFollowing ? '✓ Connected in platform' : 'Follow within platform'}
                        </span>

                        <button
                          id={`author-social-${channel.id}-btn`}
                          onClick={() => toggleFollowSocial(currentAuthorName, channel.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                            isFollowing
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : channel.btnActiveBg
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isSubscribe ? 'Subscribed' : 'Following'}</span>
                            </>
                          ) : (
                            <>
                              <BellRing className="w-3.5 h-3.5" />
                              <span>{isSubscribe ? 'Subscribe' : 'Follow'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* In-Platform Guarantee Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800">
                    Sovereign In-Platform Following Guarantee:
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Readers and guests follow authors directly within Johnnyblue1 Books Stores & Knowledge Centa without leaving the platform. When authors post updates, announce live video masterclasses, or publish draft chapters across their 6 channels, alerts are reflected directly in your reader feed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTHOR BIO-DATA & LITERARY PROFILE */}
          {(activeTab === 'bio' || activeTab === 'all') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Feather className="w-4 h-4 text-amber-600" />
                  <span>Author Bio-Data & Literary Profile</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Official Editorial Dossier
                </span>
              </div>

              {/* Bio Summary Box */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Executive Biography & Creative Focus
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {bioData.bioSummary}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {bioData.fullBio}
                </p>
              </div>

              {/* Structured Bio-Data Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Real Name & Academic Designation */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>Real Name & Academic Credentials</span>
                  </span>
                  <p className="font-bold text-slate-900">{bioData.realName}</p>
                  <p className="text-slate-500 text-[11px]">{bioData.educationOrBackground}</p>
                </div>

                {/* Publishing Philosophy */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>10-Dimension Publishing Philosophy</span>
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {bioData.publishingPhilosophy}
                  </p>
                </div>

                {/* Literary Genres */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    <span>Primary Literary Disciplines</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bioData.genres.map((genre) => (
                      <span 
                        key={genre}
                        className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-semibold rounded-md border border-slate-200"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spoken Languages & Origins */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-slate-500" />
                    <span>Languages & Geographic Residence</span>
                  </span>
                  <p className="text-slate-800 font-medium">
                    {bioData.languagesSpoken.join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Based in {bioData.location} &bull; Member since {bioData.memberSince}
                  </p>
                </div>
              </div>

              {/* Notable Published Titles in Catalog */}
              {bioData.notableWorks.length > 0 && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Notable Publications by {bioData.penName}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {bioData.notableWorks.map((work) => (
                      <button
                        key={work}
                        onClick={() => handleNavigateToBook(work)}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-800 hover:text-amber-900 rounded-lg text-xs font-medium border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                        title={`View "${work}" in bookstore`}
                      >
                        <BookOpen className="w-3 h-3 text-amber-600" />
                        <span>{work}</span>
                        <span className="text-amber-700">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {followedCount === 0 
                ? 'Select any handle above to follow without leaving.' 
                : `You are following ${followedCount} of 6 social handles for ${bioData.penName}.`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                if (allFollowed) {
                  unfollowAllSocials(currentAuthorName);
                } else {
                  followAllSocials(currentAuthorName);
                }
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {allFollowed ? 'Unfollow All Channels' : 'Follow All 6 Channels'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
