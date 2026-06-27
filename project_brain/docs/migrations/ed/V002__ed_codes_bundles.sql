-- V002 — ED codes + order bundles + board snapshots

USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ed_codes')
CREATE TABLE ed_codes (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ed_visit_id     UNIQUEIDENTIFIER NOT NULL REFERENCES ed_visits(id),
    code_name       VARCHAR(30) NOT NULL,
    activated_at    DATETIMEOFFSET NOT NULL,
    activated_by    INT,
    deactivated_at  DATETIMEOFFSET,
    outcome         VARCHAR(40)
);
CREATE INDEX IX_ed_codes_active ON ed_codes(code_name, deactivated_at) WHERE deactivated_at IS NULL;

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ed_order_bundles')
CREATE TABLE ed_order_bundles (
    id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ed_visit_id     UNIQUEIDENTIFIER NOT NULL REFERENCES ed_visits(id),
    protocol_name   VARCHAR(60) NOT NULL,
    applied_by      INT,
    applied_at      DATETIMEOFFSET,
    items_json      NVARCHAR(MAX)
);

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ed_board_snapshots')
CREATE TABLE ed_board_snapshots (
    id                          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    snapshot_at                 DATETIMEOFFSET NOT NULL,
    capacity_pct                DECIMAL(4,1),
    waiting_count               INT,
    ctas1_count                 INT,
    ctas2_count                 INT,
    ctas3_count                 INT,
    ctas4_count                 INT,
    ctas5_count                 INT,
    avg_door_to_doctor_min      INT
);

PRINT 'V002 ED codes + bundles + board snapshots created.';
GO
