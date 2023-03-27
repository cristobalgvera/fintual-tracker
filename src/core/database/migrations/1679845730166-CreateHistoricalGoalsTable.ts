import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHistoricalGoalsTable1679845730166
  implements MigrationInterface
{
  name = 'CreateHistoricalGoalsTable1679845730166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "historical_goals" ("id" SERIAL NOT NULL, "totalAmount" integer NOT NULL, "deposited" integer NOT NULL, "profit" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_56d4375dbba9c815f5b19208811" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "historical_goals"`);
  }
}
