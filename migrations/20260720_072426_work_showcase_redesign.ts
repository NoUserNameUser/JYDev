import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "showcases_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "showcases" ADD COLUMN "accent_from" varchar DEFAULT '#77e5c8';
  ALTER TABLE "showcases" ADD COLUMN "accent_to" varchar DEFAULT '#b6f35a';
  ALTER TABLE "showcases_tags" ADD CONSTRAINT "showcases_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."showcases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "showcases_tags_order_idx" ON "showcases_tags" USING btree ("_order");
  CREATE INDEX "showcases_tags_parent_id_idx" ON "showcases_tags" USING btree ("_parent_id");
  ALTER TABLE "showcases" DROP COLUMN "kind";
  DROP TYPE "public"."enum_showcases_kind";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_showcases_kind" AS ENUM('hero', 'image', 'text', 'index', 'quote');
  DROP TABLE "showcases_tags" CASCADE;
  ALTER TABLE "showcases" ADD COLUMN "kind" "enum_showcases_kind" DEFAULT 'text' NOT NULL;
  ALTER TABLE "showcases" DROP COLUMN "accent_from";
  ALTER TABLE "showcases" DROP COLUMN "accent_to";`)
}
