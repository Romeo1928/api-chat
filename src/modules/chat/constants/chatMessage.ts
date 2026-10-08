export const MESSAGE_DIRECTIONS = {
  incoming: 'incoming',
  outgoing: 'outgoing',
} as const;

export const MESSAGE_STATUSES = {
  sending: 'sending',
  sent: 'sent',
  error: 'error',
} as const;

/** GREEN-API SendMessage limit. */
export const MAX_MESSAGE_LENGTH = 4000;
