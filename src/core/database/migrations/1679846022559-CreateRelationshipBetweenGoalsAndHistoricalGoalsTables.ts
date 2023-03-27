import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationshipBetweenGoalsAndHistoricalGoalsTables1679846022559
  implements MigrationInterface
{
  name = 'CreateRelationshipBetweenGoalsAndHistoricalGoalsTables1679846022559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "goalId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD CONSTRAINT "FK_0f7625d463894b0638d07104128" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP CONSTRAINT "FK_0f7625d463894b0638d07104128"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "goalId"`,
    );
  }
}
