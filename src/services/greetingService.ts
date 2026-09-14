import { AppUser } from '../types';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GreetingInfo {
  timeOfDay: TimeOfDay;
  salutation: string;
  name: string;
  fullGreeting: string;
}

/**
 * Returns current time-of-day category based on system clock
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/**
 * Localized time-of-day salutations for the 9 supported languages
 */
export function getSalutation(timeOfDay: TimeOfDay, language = 'en'): string {
  const salutations: Record<string, Record<TimeOfDay, string>> = {
    en: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', night: 'Good evening' },
    es: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches', night: 'Buenas noches' },
    fr: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir', night: 'Bonne soirée' },
    de: { morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend', night: 'Guten Abend' },
    pt: { morning: 'Bom dia', afternoon: 'Boa tarde', evening: 'Boa noite', night: 'Boa noite' },
    ja: { morning: 'おはようございます', afternoon: 'こんにちは', evening: 'こんばんは', night: 'こんばんは' },
    zh: { morning: '早上好', afternoon: '下午好', evening: '晚上好', night: '晚上好' },
    ar: { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير', night: 'مساء الخير' },
    tw: { morning: 'Me ma wo akye', afternoon: 'Me ma wo aha', evening: 'Me ma wo adwo', night: 'Me ma wo adwo' }
  };

  const langMap = salutations[language] || salutations.en;
  return langMap[timeOfDay];
}

/**
 * Extracts personal first name, display name, or saved reader nickname
 */
export function getReaderName(user: AppUser | null, defaultGuestLabel = 'Reader'): string {
  if (user?.displayName && user.displayName.trim().length > 0) {
    const clean = user.displayName.trim();
    // Return first name for a warmer, personal feeling
    const firstWord = clean.split(/\s+/)[0];
    return firstWord || clean;
  }

  if (user?.email) {
    const prefix = user.email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  try {
    const saved = localStorage.getItem('kc_reader_nickname');
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }
  } catch {
    // Ignore storage issues
  }

  return defaultGuestLabel;
}

/**
 * Updates the reader's personalized nickname in local storage
 */
export function setReaderNickname(nickname: string): void {
  try {
    if (nickname && nickname.trim().length > 0) {
      localStorage.setItem('kc_reader_nickname', nickname.trim());
    } else {
      localStorage.removeItem('kc_reader_nickname');
    }
  } catch {
    // Ignore storage issues
  }
}

/**
 * Generates complete personalized greeting object
 */
export function getPersonalizedGreeting(
  user: AppUser | null,
  language = 'en',
  defaultGuestLabel?: string
): GreetingInfo {
  const timeOfDay = getTimeOfDay();
  const salutation = getSalutation(timeOfDay, language);
  const name = getReaderName(user, defaultGuestLabel);
  const fullGreeting = `${salutation}, ${name}`;

  return {
    timeOfDay,
    salutation,
    name,
    fullGreeting
  };
}
