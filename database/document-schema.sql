DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS station_documents CASCADE;
DROP TABLE IF EXISTS instrument_documents CASCADE;
DROP TABLE IF EXISTS calibration_documents CASCADE;
DROP TABLE IF EXISTS report_documents CASCADE;
DROP TABLE IF EXISTS ticket_documents CASCADE;
DROP TABLE IF EXISTS response_documents CASCADE;

-- IMAGES:
CREATE TABLE IF NOT EXISTS documents(
    document_id uuid DEFAULT uuid_generate_v4(),
    field_name VARCHAR(100),
    original_name VARCHAR(350),
    encoding VARCHAR(20),
    mimetype VARCHAR(100),
    filename VARCHAR(350),
    path VARCHAR(700),
    size INT,
	shareable BOOLEAN NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(document_id)
);

-- STATION_IMAGES:
CREATE TABLE IF NOT EXISTS station_documents(
    station_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_station_id FOREIGN KEY(station_id) REFERENCES stations(station_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (documents);

CREATE TABLE IF NOT EXISTS instrument_documents(
    instrument_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_instrument_id FOREIGN KEY(instrument_id) REFERENCES instruments(instrument_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (documents);

CREATE TABLE IF NOT EXISTS calibration_documents(
    calibration_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_calibration_id FOREIGN KEY(calibration_id) REFERENCES calibrations(calibration_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (documents);

CREATE TABLE IF NOT EXISTS report_documents(
    report_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_report_id FOREIGN KEY(report_id) REFERENCES reports(report_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (documents);

CREATE TABLE IF NOT EXISTS ticket_documents(
    ticket_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_ticket_id FOREIGN KEY(ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (documents);

CREATE TABLE IF NOT EXISTS response_documents(
    response_id uuid NOT NULL,
	created_by uuid NOT NULL,
	CONSTRAINT fk_response_id FOREIGN KEY(response_id) REFERENCES responses(response_id) ON DELETE CASCADE,
	CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(user_id) ON DELETE CASCADE
) INHERITS (documents);
