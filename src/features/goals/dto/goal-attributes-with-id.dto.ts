import { GoalAttributesDto } from './goal-attributes.dto';
import { GoalsResponseDto } from './goals-response.dto';

export type GoalAttributesWithIdDto = GoalAttributesDto & {
  /** Fintual ID */
  trackingId: GoalsResponseDto['data'][number]['id'];
};
