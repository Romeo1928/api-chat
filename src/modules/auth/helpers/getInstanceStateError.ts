import type { InstanceState } from 'src/modules/common/api/greenApi/constants';
import { INSTANCE_STATES } from 'src/modules/common/api/greenApi/constants';

const INSTANCE_STATE_ERRORS = {
  [INSTANCE_STATES.notAuthorized]: 'Инстанс не авторизован. Отсканируйте QR в кабинете GREEN-API.',
  [INSTANCE_STATES.blocked]: 'Инстанс заблокирован.',
  [INSTANCE_STATES.sleepMode]: 'Инстанс в спящем режиме. Включите телефон и подождите.',
  [INSTANCE_STATES.starting]: 'Инстанс запускается. Подождите и попробуйте снова.',
  [INSTANCE_STATES.yellowCard]: 'На инстансе действуют ограничения (yellowCard).',
  [INSTANCE_STATES.suspended]: 'На инстансе временные ограничения (suspended).',
} as const;

export const getInstanceStateError = (stateInstance: InstanceState): string | null => {
  if (stateInstance === INSTANCE_STATES.authorized) {
    return null;
  }

  return INSTANCE_STATE_ERRORS[stateInstance];
};
