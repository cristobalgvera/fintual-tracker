import { GoalType } from '../enum';

export type GoalAttributes = {
  name: string;
  /** Total amount */
  nav: number;
  /** Amount deposited by the user */
  deposited: number;
  /**
   * Difference between amount deposited
   * by the user and the total amount
   */
  profit: number;
  goal_type: GoalType;
};
