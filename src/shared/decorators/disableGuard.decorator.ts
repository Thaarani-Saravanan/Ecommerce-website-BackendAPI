import { SetMetadata } from '@nestjs/common';
import { GUARD_KEY } from '../constants';

export const DisableGuard = () => SetMetadata(GUARD_KEY, true);
