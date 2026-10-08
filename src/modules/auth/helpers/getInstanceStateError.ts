import { INSTANCE_STATES } from 'src/modules/common/api/greenApi/constants';
import type { GetStateInstanceResponse } from 'src/modules/common/api/greenApi/types';

const INSTANCE_STATE_ERRORS = {
  [INSTANCE_STATES.notAuthorized]: 'Инстанс не авторизован. Отсканируйте QR в кабинете GREEN-API.',
  [INSTANCE_STATES.blocked]: 'Инстанс заблокирован.',
  [INSTANCE_STATES.sleepMode]: 'Инстанс в спящем режиме. Включите телефон и подождите.',
  [INSTANCE_STATES.starting]: 'Инстанс запускается. Подождите и попробуйте снова.',
  [INSTANCE_STATES.yellowCard]: 'На инстансе действуют ограничения (yellowCard).',
  [INSTANCE_STATES.suspended]: 'На инстансе временные ограничения (suspended).',
} as const;

// Object.hasOwn instead of `in`: keys like "toString" must not match the prototype.
const checkHasStateError = (stateInstance: string): stateInstance is keyof typeof INSTANCE_STATE_ERRORS =>
  Object.hasOwn(INSTANCE_STATE_ERRORS, stateInstance);

export const getInstanceStateError = (stateInstance: GetStateInstanceResponse['stateInstance']): string | null => {
  if (stateInstance === INSTANCE_STATES.authorized) {
    return null;
  }

  return checkHasStateError(stateInstance)
    ? INSTANCE_STATE_ERRORS[stateInstance]
    : `Недоступное состояние инстанса: ${stateInstance}`;
};
