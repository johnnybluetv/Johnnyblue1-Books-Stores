/**
 * Scroll Service with Ease-Out-Quint animation curve
 * f(t) = 1 - (1 - t)^5
 * Provides ultra-smooth, responsive decelerating scroll-to-top interaction
 */

let activeScrollFrameId: number | null = null;
let activeCleanup: (() => void) | null = null;

/**
 * Calculates ease-out quintic curve
 * Rapid initial rise with an exceptionally smooth, soft deceleration to stop
 */
export const easeOutQuint = (t: number): number => {
  return 1 - Math.pow(1 - t, 5);
};

/**
 * Scrolls window to top using ease-out-quint animation curve
 * @param customDuration Optional duration in milliseconds (defaults to 850ms scaled by distance)
 */
export const scrollToTopEaseOutQuint = (customDuration?: number): void => {
  // Cancel any existing running scroll animation
  if (activeCleanup) {
    activeCleanup();
  }

  const startY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  if (startY <= 0) return;

  // Dynamically calculate comfortable duration based on distance if not explicitly passed
  // Short distance (~500px): ~600ms; Long distance (>3000px): ~950ms
  const duration = customDuration ?? Math.min(1050, Math.max(650, 450 + Math.sqrt(startY) * 8.5));
  const startTime = performance.now();

  const cancel = () => {
    if (activeScrollFrameId !== null) {
      cancelAnimationFrame(activeScrollFrameId);
      activeScrollFrameId = null;
    }
    cleanupListeners();
  };

  const onUserInteraction = () => {
    cancel();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home'].includes(e.code)) {
      cancel();
    }
  };

  const cleanupListeners = () => {
    window.removeEventListener('wheel', onUserInteraction);
    window.removeEventListener('touchmove', onUserInteraction);
    window.removeEventListener('keydown', onKeyDown);
    activeCleanup = null;
  };

  window.addEventListener('wheel', onUserInteraction, { passive: true });
  window.addEventListener('touchmove', onUserInteraction, { passive: true });
  window.addEventListener('keydown', onKeyDown, { passive: true });

  activeCleanup = cancel;

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuint(progress);

    const nextY = Math.round(startY * (1 - easedProgress));
    window.scrollTo(0, nextY);

    if (progress < 1) {
      activeScrollFrameId = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, 0);
      cancel();
    }
  };

  activeScrollFrameId = requestAnimationFrame(step);
};
