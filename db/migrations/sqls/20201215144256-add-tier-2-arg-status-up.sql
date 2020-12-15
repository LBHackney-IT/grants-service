INSERT INTO application_state(id, description)
VALUES(12, 'Tier 2 ARG application')
ON CONFLICT (id)
DO UPDATE
SET description = EXCLUDED.description;
