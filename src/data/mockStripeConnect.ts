import { StripeConnectAccount } from '../types';

export const SUPPORTED_PAYOUT_COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸', payoutSpeed: 'Daily / 2-day rolling' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵', flag: '🇬🇭', payoutSpeed: 'Daily / Mobile Money / Express Bank' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧', payoutSpeed: 'Daily / Faster Payments' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦', flag: '🇳🇬', payoutSpeed: 'Daily / Local NGN Account' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'CA$', flag: '🇨🇦', payoutSpeed: 'Daily / EFT' },
  { code: 'DE', name: 'Germany (Eurozone)', currency: 'EUR', symbol: '€', flag: '🇩🇪', payoutSpeed: 'Daily / SEPA Instant' },
  { code: 'KE', name: 'Kenya', currency: 'KES', symbol: 'KSh', flag: '🇰🇪', payoutSpeed: 'Daily / M-Pesa & Bank' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R', flag: '🇿🇦', payoutSpeed: 'Daily / EFT' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$', flag: '🇦🇺', payoutSpeed: 'Daily / BECS' },
  { code: 'FR', name: 'France (Eurozone)', currency: 'EUR', symbol: '€', flag: '🇫🇷', payoutSpeed: 'Daily / SEPA Instant' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥', flag: '🇯🇵', payoutSpeed: 'Weekly / Zengin' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$', flag: '🇸🇬', payoutSpeed: 'Daily / FAST' }
];

export const INITIAL_STRIPE_CONNECT_ACCOUNT: StripeConnectAccount = {
  id: 'stripe_connect_johnnyblue',
  authorId: 'author_johnnyblue',
  accountId: 'acct_1Nv842JohnnyBlueExpress',
  accountType: 'express',
  country: 'US',
  countryName: 'United States',
  defaultCurrency: 'USD',
  businessType: 'individual',
  chargesEnabled: true,
  payoutsEnabled: true,
  detailsSubmitted: true,
  email: 'johnnyblueagency@gmail.com',
  businessProfileName: 'Johnny Blue Literary & Architectural Sovereign Press',
  supportPhone: '+233 55 541 4967',
  payoutSchedule: {
    interval: 'daily',
    delayDays: 2,
    weeklyAnchor: 'friday',
    monthlyAnchor: 1
  },
  payoutBank: {
    bankName: 'JPMorgan Chase & Co. / Stanbic Bank International',
    last4: '8842',
    routingNumber: '021000021',
    currency: 'USD',
    status: 'verified'
  },
  balances: {
    available: 4850.75,
    pending: 1620.40,
    currency: 'USD',
    lifetimePaidOut: 64280.00,
    lastPayoutAmount: 2450.00,
    lastPayoutDate: '2026-09-08T14:30:00.000Z',
    nextPayoutDate: '2026-09-15T00:00:00.000Z'
  },
  requirements: {
    currentlyDue: [],
    eventuallyDue: [],
    pastDue: []
  },
  transactions: [
    {
      id: 'po_1Pv9372091JBAch',
      amount: 2450.00,
      currency: 'USD',
      status: 'paid',
      arrivalDate: '2026-09-08',
      createdDate: '2026-09-06',
      destinationBank: 'JPMorgan Chase (****8842)',
      method: 'standard_ach',
      description: 'Weekly Author Royalty Auto-Payout (85% Sovereign Share)',
      feeAmount: 0.00,
      netAmount: 2450.00
    },
    {
      id: 'po_1Pu8261902JBInstant',
      amount: 1840.50,
      currency: 'USD',
      status: 'paid',
      arrivalDate: '2026-09-01',
      createdDate: '2026-09-01',
      destinationBank: 'Debit Card Instant Transfer',
      method: 'instant_card',
      description: 'End-of-Month Master Scans & Silk Editions Settlement',
      feeAmount: 18.40,
      netAmount: 1822.10
    },
    {
      id: 'po_1Pt7150893JBAch',
      amount: 3210.00,
      currency: 'USD',
      status: 'paid',
      arrivalDate: '2026-08-25',
      createdDate: '2026-08-23',
      destinationBank: 'JPMorgan Chase (****8842)',
      method: 'standard_ach',
      description: '10-Dimension Release Pre-order Royalty Batch',
      feeAmount: 0.00,
      netAmount: 3210.00
    },
    {
      id: 'po_1Ps6049784JBMoMo',
      amount: 1420.00,
      currency: 'USD',
      status: 'paid',
      arrivalDate: '2026-08-18',
      createdDate: '2026-08-18',
      destinationBank: 'Stanbic Bank / MTN MoMo Express (+233 55 541 4967)',
      method: 'momo',
      description: 'Ghana & West Africa Direct Audiobooks & E-Ink Royalties',
      feeAmount: 5.00,
      netAmount: 1415.00
    }
  ],
  livemode: true,
  connectedAt: '2026-01-15T10:00:00.000Z',
  dashboardLoginLink: 'https://connect.stripe.com/express/acct_1Nv842JohnnyBlueExpress'
};
