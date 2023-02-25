import { GoalAttributes } from './goal-attributes.model';

export type GoalsResponse = {
  data: [
    {
      id: string;
      type: 'goal';
      attributes: GoalAttributes;
    },
  ];
};
