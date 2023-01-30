/** @type {import('next').NextConfig} */

// https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = [
  ['default-src', "'none'"],
  ['base-uri', "'self'"],
  [
    'script-src',
    "'self'",
    'unpkg.com/web-vitals/dist/web-vitals.iife.js',
    // next.js requires unsafe directives locally for faster execution
    process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval'"
  ],
  ['child-src', "'self'"],
  ['style-src', "'self'", "'unsafe-inline'"],
  [
    'img-src',
    "'self'",
    'w3.org/',
    'data:'
  ],
  [
    'connect-src',
    "'self'",
    'blob: data:',
    '*.herondata.io/',
    'vitals.vercel-insights.com/v1/vitals'
  ],
  ['frame-ancestors', "'self'"],
  [
    'frame-src',
    "'self'",
    'data:',
    'blob: data:'
  ],
  ['prefetch-src', "'self'"]
]
  .map((x) => x.join(' '))
  .reduce((x, y) => `${x}; ${y}`, '')
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'same-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]

module.exports = {
  async headers () {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  }
}
