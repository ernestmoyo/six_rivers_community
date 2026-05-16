-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "OperationalLocationKind" AS ENUM ('village', 'ward', 'hamlet');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('matched', 'alias_override', 'missing_in_shapefile', 'decommissioned', 'split_disputed', 'pending');

-- CreateEnum
CREATE TYPE "BeneficiaryKind" AS ENUM ('individual', 'group', 'school', 'mixed');

-- CreateEnum
CREATE TYPE "SectorScope" AS ENUM ('msolwa', 'usangu', 'both', 'outreach');

-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('active', 'struggling', 'dormant', 'closed');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('enrolled', 'active', 'graduated', 'dropped_out', 'transferred', 'withdrawn');

-- CreateEnum
CREATE TYPE "TransactionKind" AS ENUM ('capital', 'revenue', 'expense', 'distribution');

-- CreateEnum
CREATE TYPE "TocScope" AS ENUM ('pillar', 'programme');

-- CreateEnum
CREATE TYPE "TocLevel" AS ENUM ('input', 'activity', 'output', 'outcome', 'impact');

-- CreateEnum
CREATE TYPE "IndicatorComputation" AS ENUM ('manual', 'derived');

-- CreateEnum
CREATE TYPE "IndicatorPeriodKind" AS ENUM ('year', 'quarter', 'month');

-- CreateEnum
CREATE TYPE "IndicatorSource" AS ENUM ('auto', 'manual');

-- CreateEnum
CREATE TYPE "StudentAccountStatus" AS ENUM ('pending', 'approved', 'suspended');

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "population" INTEGER,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "population" INTEGER,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ward_id" INTEGER NOT NULL,
    "is_operational" BOOLEAN NOT NULL DEFAULT false,
    "sector" TEXT,
    "distance_to_np_km" DOUBLE PRECISION,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operational_locations" (
    "id" SERIAL NOT NULL,
    "kind" "OperationalLocationKind" NOT NULL,
    "display_name" TEXT NOT NULL,
    "canonical_village_id" INTEGER,
    "canonical_ward_id" INTEGER,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reconciliation_status" "ReconciliationStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "geom" geography(Point, 4326),
    "is_operational" BOOLEAN NOT NULL DEFAULT true,
    "sector" TEXT,
    "created_by_officer_id" TEXT,
    "reviewed_by_officer_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operational_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pillars" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "placeholder" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pillars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pillar_id" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subprogrammes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "programme_id" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "subprogrammes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subprogramme_id" INTEGER NOT NULL,
    "beneficiary_kind" "BeneficiaryKind" NOT NULL,
    "sector_scope" "SectorScope" NOT NULL,
    "start_year" INTEGER,
    "end_year" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_variants" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT,
    "activity_id" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "activity_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "sex" TEXT,
    "dob" DATE,
    "age" INTEGER,
    "phone" TEXT,
    "national_id" TEXT,
    "school_class" TEXT,
    "operational_location_id" INTEGER,
    "dedup_hash" TEXT NOT NULL,
    "demographics_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "operational_location_id" INTEGER NOT NULL,
    "level" TEXT,
    "head_teacher" TEXT,
    "contact_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "operational_location_id" INTEGER,
    "formed_at" DATE,
    "status" "GroupStatus" NOT NULL DEFAULT 'active',
    "sector" TEXT,
    "leader_person_id" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_memberships" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "joined_at" DATE NOT NULL,
    "left_at" DATE,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "cohort_year" INTEGER NOT NULL,
    "person_id" INTEGER,
    "group_id" INTEGER,
    "school_id" INTEGER,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'enrolled',
    "started_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" DATE,
    "exit_reason" TEXT,
    "exit_reason_category" TEXT,
    "meta_json" JSONB,
    "synced_from_form_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_transactions" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "period_year_month" TEXT NOT NULL,
    "kind" "TransactionKind" NOT NULL,
    "amount_tsh" DECIMAL(14,2) NOT NULL,
    "category" TEXT,
    "narrative" TEXT,
    "recorded_by_officer_id" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_schemas" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER,
    "kobo_form_uid" TEXT,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "schema_json" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" SERIAL NOT NULL,
    "form_schema_id" INTEGER NOT NULL,
    "person_id" INTEGER,
    "operational_location_id" INTEGER,
    "payload_json" JSONB NOT NULL,
    "gps_lat" DOUBLE PRECISION,
    "gps_lng" DOUBLE PRECISION,
    "geom" geography(Point, 4326),
    "submitted_by_officer_id" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "synced_at" TIMESTAMP(3),
    "idempotency_key" TEXT,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theories_of_change" (
    "id" SERIAL NOT NULL,
    "scope" "TocScope" NOT NULL,
    "pillar_id" INTEGER,
    "programme_id" INTEGER,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "narrative" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theories_of_change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toc_nodes" (
    "id" SERIAL NOT NULL,
    "toc_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "level" "TocLevel" NOT NULL,
    "statement" TEXT NOT NULL,
    "note" TEXT,
    "parent_id" INTEGER,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "toc_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicators" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" "TocLevel" NOT NULL,
    "unit" TEXT NOT NULL,
    "disaggregate_by" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "computation" "IndicatorComputation" NOT NULL DEFAULT 'manual',
    "derived_query" TEXT,
    "toc_node_id" INTEGER,
    "toc_node_code" TEXT,
    "programme_id" INTEGER,
    "activity_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_periods" (
    "id" SERIAL NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "period_kind" "IndicatorPeriodKind" NOT NULL,
    "period_key" TEXT NOT NULL,
    "target" DECIMAL(18,4),
    "actual" DECIMAL(18,4),
    "source" "IndicatorSource" NOT NULL DEFAULT 'auto',
    "disaggregation_json" JSONB,
    "updated_by_officer_id" TEXT,
    "computed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicator_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_accounts" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" "StudentAccountStatus" NOT NULL DEFAULT 'pending',
    "approved_by_officer_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "student_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "operational_locations_reconciliation_status_idx" ON "operational_locations"("reconciliation_status");

-- CreateIndex
CREATE INDEX "operational_locations_sector_idx" ON "operational_locations"("sector");

-- CreateIndex
CREATE UNIQUE INDEX "pillars_code_key" ON "pillars"("code");

-- CreateIndex
CREATE UNIQUE INDEX "programmes_code_key" ON "programmes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subprogrammes_code_key" ON "subprogrammes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "activities_code_key" ON "activities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "activity_variants_activity_id_code_key" ON "activity_variants"("activity_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "persons_dedup_hash_key" ON "persons"("dedup_hash");

-- CreateIndex
CREATE INDEX "persons_full_name_idx" ON "persons"("full_name");

-- CreateIndex
CREATE INDEX "groups_activity_id_idx" ON "groups"("activity_id");

-- CreateIndex
CREATE INDEX "groups_status_idx" ON "groups"("status");

-- CreateIndex
CREATE INDEX "group_memberships_group_id_idx" ON "group_memberships"("group_id");

-- CreateIndex
CREATE INDEX "group_memberships_person_id_idx" ON "group_memberships"("person_id");

-- CreateIndex
CREATE INDEX "enrollments_activity_id_cohort_year_idx" ON "enrollments"("activity_id", "cohort_year");

-- CreateIndex
CREATE INDEX "enrollments_status_cohort_year_idx" ON "enrollments"("status", "cohort_year");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_activity_id_cohort_year_person_id_group_id_scho_key" ON "enrollments"("activity_id", "cohort_year", "person_id", "group_id", "school_id");

-- CreateIndex
CREATE INDEX "group_transactions_group_id_period_year_month_idx" ON "group_transactions"("group_id", "period_year_month");

-- CreateIndex
CREATE INDEX "group_transactions_period_year_month_idx" ON "group_transactions"("period_year_month");

-- CreateIndex
CREATE INDEX "form_schemas_kobo_form_uid_idx" ON "form_schemas"("kobo_form_uid");

-- CreateIndex
CREATE UNIQUE INDEX "form_schemas_activity_id_version_key" ON "form_schemas"("activity_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "form_submissions_idempotency_key_key" ON "form_submissions"("idempotency_key");

-- CreateIndex
CREATE INDEX "form_submissions_form_schema_id_idx" ON "form_submissions"("form_schema_id");

-- CreateIndex
CREATE INDEX "form_submissions_submitted_at_idx" ON "form_submissions"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "theories_of_change_scope_pillar_id_programme_id_version_key" ON "theories_of_change"("scope", "pillar_id", "programme_id", "version");

-- CreateIndex
CREATE INDEX "toc_nodes_level_idx" ON "toc_nodes"("level");

-- CreateIndex
CREATE UNIQUE INDEX "toc_nodes_toc_id_code_key" ON "toc_nodes"("toc_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "indicators_code_key" ON "indicators"("code");

-- CreateIndex
CREATE INDEX "indicators_level_idx" ON "indicators"("level");

-- CreateIndex
CREATE INDEX "indicators_programme_id_idx" ON "indicators"("programme_id");

-- CreateIndex
CREATE INDEX "indicators_activity_id_idx" ON "indicators"("activity_id");

-- CreateIndex
CREATE INDEX "indicator_periods_period_key_idx" ON "indicator_periods"("period_key");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_periods_indicator_id_period_kind_period_key_key" ON "indicator_periods"("indicator_id", "period_kind", "period_key");

-- CreateIndex
CREATE UNIQUE INDEX "student_accounts_person_id_key" ON "student_accounts"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_accounts_email_key" ON "student_accounts"("email");

-- CreateIndex
CREATE INDEX "student_accounts_status_idx" ON "student_accounts"("status");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operational_locations" ADD CONSTRAINT "operational_locations_canonical_village_id_fkey" FOREIGN KEY ("canonical_village_id") REFERENCES "villages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operational_locations" ADD CONSTRAINT "operational_locations_canonical_ward_id_fkey" FOREIGN KEY ("canonical_ward_id") REFERENCES "wards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_pillar_id_fkey" FOREIGN KEY ("pillar_id") REFERENCES "pillars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subprogrammes" ADD CONSTRAINT "subprogrammes_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_subprogramme_id_fkey" FOREIGN KEY ("subprogramme_id") REFERENCES "subprogrammes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_variants" ADD CONSTRAINT "activity_variants_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_operational_location_id_fkey" FOREIGN KEY ("operational_location_id") REFERENCES "operational_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_operational_location_id_fkey" FOREIGN KEY ("operational_location_id") REFERENCES "operational_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_operational_location_id_fkey" FOREIGN KEY ("operational_location_id") REFERENCES "operational_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_memberships" ADD CONSTRAINT "group_memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_memberships" ADD CONSTRAINT "group_memberships_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_synced_from_form_id_fkey" FOREIGN KEY ("synced_from_form_id") REFERENCES "form_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_transactions" ADD CONSTRAINT "group_transactions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_schemas" ADD CONSTRAINT "form_schemas_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_schema_id_fkey" FOREIGN KEY ("form_schema_id") REFERENCES "form_schemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_operational_location_id_fkey" FOREIGN KEY ("operational_location_id") REFERENCES "operational_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theories_of_change" ADD CONSTRAINT "theories_of_change_pillar_id_fkey" FOREIGN KEY ("pillar_id") REFERENCES "pillars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theories_of_change" ADD CONSTRAINT "theories_of_change_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toc_nodes" ADD CONSTRAINT "toc_nodes_toc_id_fkey" FOREIGN KEY ("toc_id") REFERENCES "theories_of_change"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toc_nodes" ADD CONSTRAINT "toc_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "toc_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_toc_node_id_fkey" FOREIGN KEY ("toc_node_id") REFERENCES "toc_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_programme_id_fkey" FOREIGN KEY ("programme_id") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_periods" ADD CONSTRAINT "indicator_periods_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_accounts" ADD CONSTRAINT "student_accounts_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
