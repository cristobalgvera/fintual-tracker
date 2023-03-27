import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetCurrencyRelatedColumnsToDecimalInHistoricalGoalsTable1679944621234
  implements MigrationInterface
{
  name =
    'SetCurrencyRelatedColumnsToDecimalInHistoricalGoalsTable1679944621234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "totalAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "totalAmount" numeric(18,4) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "deposited"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "deposited" numeric(18,4) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "profit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "profit" numeric(18,4) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "profit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "profit" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "deposited"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "deposited" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" DROP COLUMN "totalAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "historical_goals" ADD "totalAmount" integer NOT NULL`,
    );
  }
}
