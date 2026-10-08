export const toChatId = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');

  return `${digits}@c.us`;
};
