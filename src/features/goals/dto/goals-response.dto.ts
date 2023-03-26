import { GoalAttributesDto } from './goal-attributes.dto';

export type GoalsResponseDto = {
  data: [
    {
      id: string;
      type: 'goal';
      attributes: GoalAttributesDto;
    },
  ];
};
