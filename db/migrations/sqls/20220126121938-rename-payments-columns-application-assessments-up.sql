ALTER TABLE application_assessment DROP COLUMN grant_amount_awarded_round_2;
ALTER TABLE application_assessment DROP COLUMN round_1_payment_exported;
ALTER TABLE application_assessment DROP COLUMN round_2_payment_exported;
ALTER TABLE application_assessment ADD COLUMN payment_exported BOOLEAN NOT NULL DEFAULT false;
