import { UserSession } from '../types/auth';

/**
 * Validates email address format using standard regex.
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Calculates password strength score (0-100) and qualitative feedback.
 */
export interface PasswordStrength {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: 'rose' | 'amber' | 'cyan' | 'emerald';
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Very Weak', color: 'rose', feedback: ['Password cannot be empty'] };
  }

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 25;
  else feedback.push('At least 8 characters required');

  if (/[A-Z]/.test(password)) score += 25;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score += 25;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  else feedback.push('Include special characters');

  let label: PasswordStrength['label'] = 'Very Weak';
  let color: PasswordStrength['color'] = 'rose';

  if (score >= 100) {
    label = 'Very Strong';
    color = 'emerald';
  } else if (score >= 75) {
    label = 'Strong';
    color = 'emerald';
  } else if (score >= 50) {
    label = 'Fair';
    color = 'cyan';
  } else if (score >= 25) {
    label = 'Weak';
    color = 'amber';
  }

  return { score, label, color, feedback };
}

/**
 * Generates a mock JWT-style token string for local authentication session.
 */
export function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
    })
  );
  const signature = Math.random().toString(36).substring(2, 15);
  return `${header}.${payload}.${signature}`;
}

/**
 * Checks if a session is expired based on its ISO timestamp.
 */
export function isSessionExpired(session: UserSession | null): boolean {
  if (!session) return true;
  const expiresAt = new Date(session.expiresAt).getTime();
  return Date.now() >= expiresAt;
}

/**
 * Sanitizes input text to prevent XSS.
 */
export function sanitizeInput(text: string): string {
  return text.replace(/[<>]/g, '').trim();
}
