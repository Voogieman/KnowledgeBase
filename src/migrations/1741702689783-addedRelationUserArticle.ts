import { MigrationInterface, QueryRunner } from "typeorm";

export class  addedRelationUserArticle1741702689783 implements MigrationInterface {
    name = 'addedRelationUserArticle1741702689783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "authorId" uuid`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "authorId"`);
    }

}
