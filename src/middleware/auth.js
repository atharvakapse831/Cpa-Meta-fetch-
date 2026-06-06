const { ALLOWED_ORIGINS, API_KEY } = require('../config');

/**
 * Layer 1 — API Key check
 * Every request must have: x-api-key: <secret>
 */
function apiKeyAuth(req, res, next) {
  if (!API_KEY) {
    // Not configured — block everything in production, warn in dev
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ error: 'Service not configured' });
    }
    console.warn('[AUTH] WARNING: META_SERVICE_API_KEY not set — running unprotected');
    return next();
  }

  const provided = req.headers['x-api-key'];
  if (!provided || provided !== API_KEY) {
    console.warn(`[AUTH] Rejected request — invalid or missing x-api-key from ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

/**
 * Layer 2 — Origin whitelist
 * Only allow requests from known CPA backend URLs.
 * Checks both Origin and Referer headers + x-forwarded-host.
 * If ALLOWED_ORIGINS is empty, skips check (dev mode).
 */
function originWhitelist(req, res, next) {
  if (!ALLOWED_ORIGINS || ALLOWED_ORIGINS.length === 0) return next();

  const origin  = req.headers['origin']   || '';
  const referer = req.headers['referer']  || '';
  const host    = req.headers['x-forwarded-host'] || req.headers['host'] || '';

  const allowed = ALLOWED_ORIGINS.some(o =>
    origin.startsWith(o) || referer.startsWith(o) || host.includes(o)
  );

  if (!allowed) {
    console.warn(`[AUTH] Blocked origin: origin=${origin} referer=${referer} host=${host}`);
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}

/**
 * Combined auth — apply both layers.
 * Import this in routes.
 */
function auth(req, res, next) {
  apiKeyAuth(req, res, (err) => {
    if (err) return next(err);
    originWhitelist(req, res, next);
  });
}

module.exports = { auth };
