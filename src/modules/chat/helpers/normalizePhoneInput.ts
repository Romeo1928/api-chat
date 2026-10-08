export const normalizePhoneInput = (phone: string): string => phone.replace(/\D/g, '');

/** Expects digits from normalizePhoneInput. */
export const checkIsValidPhone = (digits: string): boolean => digits.length >= 10 && digits.length <= 15;
