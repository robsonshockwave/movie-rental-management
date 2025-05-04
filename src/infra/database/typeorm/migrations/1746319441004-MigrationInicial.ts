import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationInicial1746319441004 implements MigrationInterface {
    name = 'MigrationInicial1746319441004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "genre" character varying NOT NULL, "quantity" integer NOT NULL, "ISAN" character varying NOT NULL, "author" character varying NOT NULL, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hires" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requested_date" character varying NOT NULL, "delivery_date" character varying NOT NULL, "return_date" text, "client_id" uuid, "movie_id" uuid, CONSTRAINT "PK_230bc94f7f21d861b3ce5b209b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hires" ADD CONSTRAINT "FK_49208550668b64333f20f0ca4a8" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hires" ADD CONSTRAINT "FK_fa489fb96f7a978c280844beda3" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hires" DROP CONSTRAINT "FK_fa489fb96f7a978c280844beda3"`);
        await queryRunner.query(`ALTER TABLE "hires" DROP CONSTRAINT "FK_49208550668b64333f20f0ca4a8"`);
        await queryRunner.query(`DROP TABLE "hires"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
