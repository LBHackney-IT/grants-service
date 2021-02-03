ALTER TABLE business ADD COLUMN previously_applied BOOLEAN;
ALTER TABLE business ADD COLUMN previous_application_id TEXT;
ALTER TABLE business ADD COLUMN trading_days_per_week TEXT;

ALTER TABLE declaration ADD COLUMN business_permit_data_round_2 BOOLEAN;
