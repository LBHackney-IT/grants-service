ALTER TABLE application_assessment ADD COLUMN grant_amount_awarded_round_2 NUMERIC(12, 2);
ALTER TABLE application_assessment ADD COLUMN round_1_payment_exported BOOLEAN;
ALTER TABLE application_assessment ADD COLUMN round_2_payment_exported BOOLEAN;
ALTER TABLE application_assessment DROP COLUMN payment_exported;