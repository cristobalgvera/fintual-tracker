import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoalsTable1679840757798 implements MigrationInterface {
  name = 'CreateGoalsTable1679840757798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0c9e8e1314b06f15da4191c67a" ON "goals" ("name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0c9e8e1314b06f15da4191c67a"`,
    );
    await queryRunner.query(`DROP TABLE "goals"`);
  }
}
