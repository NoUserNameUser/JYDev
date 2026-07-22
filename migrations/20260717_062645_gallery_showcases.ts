import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_showcases_kind" AS ENUM('hero', 'image', 'text', 'index', 'quote');
  CREATE TABLE "showcases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"kicker" varchar,
  	"meta" varchar,
  	"kind" "enum_showcases_kind" DEFAULT 'text' NOT NULL,
  	"body" varchar,
  	"image_id" integer,
  	"image_url" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"link_open_in_new_tab" boolean DEFAULT false,
  	"order_index" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "showcases_id" integer;
  ALTER TABLE "showcases" ADD CONSTRAINT "showcases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "showcases_image_idx" ON "showcases" USING btree ("image_id");
  CREATE UNIQUE INDEX "showcases_order_index_idx" ON "showcases" USING btree ("order_index");
  CREATE INDEX "showcases_updated_at_idx" ON "showcases" USING btree ("updated_at");
  CREATE INDEX "showcases_created_at_idx" ON "showcases" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_showcases_fk" FOREIGN KEY ("showcases_id") REFERENCES "public"."showcases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_showcases_id_idx" ON "payload_locked_documents_rels" USING btree ("showcases_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "showcases" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "showcases" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_showcases_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_showcases_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "showcases_id";
  DROP TYPE "public"."enum_showcases_kind";`)
}
