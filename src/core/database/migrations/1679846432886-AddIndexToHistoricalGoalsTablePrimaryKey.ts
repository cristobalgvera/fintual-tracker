import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToHistoricalGoalsTablePrimaryKey1679846432886
  implements MigrationInterface
{
  name = 'AddIndexToHistoricalGoalsTablePrimaryKey1679846432886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_56d4375dbba9c815f5b1920881" ON "historical_goals" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56d4375dbba9c815f5b1920881"`,
    );
  }
}
