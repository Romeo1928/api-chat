export const INSTANCE_STATES = {
  authorized: 'authorized',
  notAuthorized: 'notAuthorized',
  blocked: 'blocked',
  sleepMode: 'sleepMode',
  starting: 'starting',
  yellowCard: 'yellowCard',
  suspended: 'suspended',
} as const;

export type InstanceState = (typeof INSTANCE_STATES)[keyof typeof INSTANCE_STATES];

export const WEBHOOK_TYPES = {
  incomingMessageReceived: 'incomingMessageReceived',
  outgoingMessageReceived: 'outgoingMessageReceived',
  outgoingAPIMessageReceived: 'outgoingAPIMessageReceived',
  outgoingMessageStatus: 'outgoingMessageStatus',
  stateInstanceChanged: 'stateInstanceChanged',
} as const;

export type WebhookType = (typeof WEBHOOK_TYPES)[keyof typeof WEBHOOK_TYPES];
