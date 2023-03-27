import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoalTypeColumnToGoalsTable1679884121883
  implements MigrationInterface
{
  name = 'AddGoalTypeColumnToGoalsTable1679884121883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."goals_goaltype_enum" AS ENUM('short_term', 'apv', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "goals" ADD "goalType" "public"."goals_goaltype_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goals" DROP COLUMN "goalType"`);
    await queryRunner.query(`DROP TYPE "public"."goals_goaltype_enum"`);
  }
}
