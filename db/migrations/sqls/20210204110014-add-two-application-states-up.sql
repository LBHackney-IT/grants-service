INSERT INTO application_state(id, description)
VALUES(11, 'Processed - Requested Information')
ON CONFLICT (id)
DO UPDATE
SET description = EXCLUDED.description;

INSERT INTO application_state(id, description)
VALUES(12, 'LRSG Eligible')
ON CONFLICT (id)
DO UPDATE
SET description = EXCLUDED.description;
