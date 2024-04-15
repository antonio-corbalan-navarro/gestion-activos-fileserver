DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS station_images CASCADE;
DROP TABLE IF EXISTS instrument_images CASCADE;
DROP TABLE IF EXISTS calibration_images CASCADE;
DROP TABLE IF EXISTS report_images CASCADE;
DROP TABLE IF EXISTS ticket_images CASCADE;
DROP TABLE IF EXISTS response_images CASCADE;

-- IMAGES:
CREATE TABLE IF NOT EXISTS images(
    image_id uuid DEFAULT uuid_generate_v4(),
    field_name VARCHAR(350),
    original_name VARCHAR(100),
    encoding VARCHAR(20),
    mimetype VARCHAR(100),
    filename VARCHAR(350),
    path VARCHAR(700),
    size INT,
	shareable BOOLEAN NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(image_id)
);

-- STATION_IMAGES:
CREATE TABLE IF NOT EXISTS station_images(
    station_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_station_id FOREIGN KEY(station_id) REFERENCES stations(station_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (images);

CREATE TABLE IF NOT EXISTS instrument_images(
    instrument_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_instrument_id FOREIGN KEY(instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (images);

CREATE TABLE IF NOT EXISTS calibration_images(
    calibration_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_calibration_id FOREIGN KEY(calibration_id) REFERENCES calibrations(calibration_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (images);

CREATE TABLE IF NOT EXISTS report_images(
    report_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_report_id FOREIGN KEY(report_id) REFERENCES reports(report_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (images);

CREATE TABLE IF NOT EXISTS ticket_images(
    ticket_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_ticket_id FOREIGN KEY(ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (images);

CREATE TABLE IF NOT EXISTS response_images(
    response_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_response_id FOREIGN KEY(response_id) REFERENCES responses(response_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (images);
