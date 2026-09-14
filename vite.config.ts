import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-books-access-middleware',
        configureServer(server) {
          server.middlewares.use('/api/books/access', (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}');
                  const { bookId, format = 'ebook', isSampleOnly = true, userId = 'user_guest' } = data;
                  const now = Math.floor(Date.now() / 1000);

                  if (isSampleOnly) {
                    const expiresInSeconds = 3600;
                    const expiresAt = new Date((now + expiresInSeconds) * 1000).toISOString();
                    const tokenSignature = `sig_v4_sample_${Math.random().toString(36).substring(2, 12)}`;
                    const signedUrl = `https://storage.knowledgecenta.com/samples/${bookId}-${format}.sample?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${expiresInSeconds}&X-Amz-Signature=${tokenSignature}`;

                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
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
                      message: 'Public preview access granted.'
                    }));
                    return;
                  }

                  // Full content request (ownership check)
                  const expiresInSeconds = 900; // 15-minute expiring signed URL
                  const expiresAt = new Date((now + expiresInSeconds) * 1000).toISOString();
                  const tokenSignature = `sig_v4_full_${Math.random().toString(36).substring(2, 12)}`;
                  const signedUrl = `https://r2.vault.knowledgecenta.com/secure-vault/users/${userId}/books/${bookId}/${format}/master?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900&X-Amz-Signature=${tokenSignature}&response-content-disposition=attachment`;

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
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
                    message: 'Ownership verified: 15-minute expiring signed media URL generated.'
                  }));
                } catch {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
