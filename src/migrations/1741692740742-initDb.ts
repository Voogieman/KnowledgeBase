import { MigrationInterface, QueryRunner } from "typeorm";

export class  initDb1741692740742 implements MigrationInterface {
    name = 'initDb1741692740742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "tags" text NOT NULL, "isPublic" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "refreshToken" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "article"`);
    }

}
