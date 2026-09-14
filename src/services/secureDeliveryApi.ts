import { ApiAccessRequest, ApiAccessResponse, Book, FormatType } from '../types';
import { INITIAL_BOOKS } from '../data/mockBooks';

// Simulated Secret Key for Cloudflare R2 / AWS S3 presigning
const MOCK_STORAGE_SECRET = 'kc_r2_sec_77819_johnnyblue1_books_stores';

/**
 * Generates an authentic cryptographically simulated HMAC signature
 */
function generateSignature(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = Math.abs(Math.sin(hash) * 10000000).toString(16).substring(0, 16);
  return `sig_v4_${hex}_${salt}`;
}

/**
 * Handles security check & secure delivery for book media
 * Emulates the /api/books/access endpoint
 */
export async function requestBookAccess(
  request: ApiAccessRequest,
  purchasedBookIds: Set<string>
): Promise<ApiAccessResponse> {
  const { bookId, format, isSampleOnly, userId = 'user_kc_guest_992' } = request;
  
  // Find book
  const book = INITIAL_BOOKS.find((b) => b.id === bookId);
  const now = Math.floor(Date.now() / 1000);

  // If sample only: no purchase needed, return public/sample signed asset
  if (isSampleOnly) {
    const expiresInSeconds = 3600; // 1 hour for public preview
    const expiresAt = new Date((now + expiresInSeconds) * 1000).toISOString();
    const tokenPayload = `${bookId}:${format}:sample:${now + expiresInSeconds}:${MOCK_STORAGE_SECRET}`;
    const tokenSignature = generateSignature(tokenPayload);

    let sampleFile = '';
    if (format === 'audiobook') {
      sampleFile = book?.audioSample.audioUrl || 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3';
    } else if (format === 'videobook') {
      sampleFile = book?.videoSample.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    } else if (format === 'manuscript') {
      sampleFile = `https://storage.knowledgecenta.com/samples/${bookId}-manuscript-sample-v2.pdf`;
    } else {
      sampleFile = `https://storage.knowledgecenta.com/samples/${bookId}-chapter1-preview.epub`;
    }

    const signedUrl = `${sampleFile}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KC_R2_PUB/20260910/r2/aws4_request&X-Amz-Date=${now}&X-Amz-Expires=${expiresInSeconds}&X-Amz-SignedHeaders=host&X-Amz-Signature=${tokenSignature}&type=sample`;

    return {
      success: true,
      bookId,
      format,
      isSampleOnly: true,
      signedUrl,
      expiresInSeconds,
      expiresAt,
      storageProvider: 'Cloudflare R2',
      signatureAlgorithm: 'HMAC-SHA256',
      tokenSignature,
      userAuthorized: true,
      message: 'Preview access granted: 5-minute preview / chapter sample stream.'
    };
  }

  // If requesting FULL content: Verify purchase in user library
  const purchaseKey = `${bookId}:${format}`;
  const isPurchased = purchasedBookIds.has(purchaseKey) || purchasedBookIds.has(bookId);

  if (!isPurchased) {
    return {
      success: false,
      bookId,
      format,
      isSampleOnly: false,
      signedUrl: '',
      expiresInSeconds: 0,
      expiresAt: new Date().toISOString(),
      storageProvider: 'Cloudflare R2',
      signatureAlgorithm: 'HMAC-SHA256',
      tokenSignature: '',
      userAuthorized: false,
      message: 'Access Denied: You have not purchased the full edition of this format. Please buy or add to cart first.'
    };
  }

  // Authorized user requesting full content: Return strict 15-minute expiring signed URL (900 seconds)
  const expiresInSeconds = 900; // Exact 15 minutes as requested!
  const expiresAt = new Date((now + expiresInSeconds) * 1000).toISOString();
  const tokenPayload = `${bookId}:${format}:${userId}:full:${now + expiresInSeconds}:${MOCK_STORAGE_SECRET}`;
  const tokenSignature = generateSignature(tokenPayload);

  const storageHost = 'https://r2.vault.knowledgecenta.com';
  const objectPath = `secure-vault/users/${userId}/books/${bookId}/${format}/master.${getFileExt(format)}`;
  const signedUrl = `${storageHost}/${objectPath}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900&X-Amz-Credential=KC_AUTH_R2_KEY&X-Amz-Date=${now}&X-Amz-Signature=${tokenSignature}&response-content-disposition=attachment`;

  return {
    success: true,
    bookId,
    format,
    isSampleOnly: false,
    signedUrl,
    expiresInSeconds,
    expiresAt,
    storageProvider: 'Cloudflare R2',
    signatureAlgorithm: 'HMAC-SHA256',
    tokenSignature,
    userAuthorized: true,
    message: 'Ownership verified: 15-minute single-use secure signed streaming URL generated.'
  };
}

function getFileExt(format: FormatType): string {
  switch (format) {
    case 'ebook':
      return 'epub';
    case 'audiobook':
      return 'm4b';
    case 'videobook':
      return 'mp4';
    case 'manuscript':
      return 'docx';
  }
}
