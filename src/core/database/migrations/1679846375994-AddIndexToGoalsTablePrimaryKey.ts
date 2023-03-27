import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToGoalsTablePrimaryKey1679846375994
  implements MigrationInterface
{
  name = 'AddIndexToGoalsTablePrimaryKey1679846375994';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_26e17b251afab35580dff76922" ON "goals" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_26e17b251afab35580dff76922"`,
    );
  }
}
