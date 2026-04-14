-- Replace the two integer age columns with a single DATE column.
-- Day is always stored as 1 (first of month) — month+year precision only.

ALTER TABLE "animals" DROP COLUMN "age_years";
ALTER TABLE "animals" DROP COLUMN "age_months";
ALTER TABLE "animals" ADD COLUMN "birth_date" DATE NOT NULL DEFAULT '2020-01-01';
