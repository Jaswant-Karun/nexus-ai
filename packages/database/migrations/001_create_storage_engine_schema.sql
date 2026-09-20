-- ============================================================================
-- NEXUS AI — AI-Aware Intelligent Storage Engine Database Schema
-- Migration: 001_create_storage_engine_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- 1. OBJECT STORAGE MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS storage_buckets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    region VARCHAR(100) DEFAULT 'us-east-1',
    is_public BOOLEAN DEFAULT FALSE,
    versioning_enabled BOOLEAN DEFAULT TRUE,
    encryption_algorithm VARCHAR(50) DEFAULT 'AES256',
    quota_bytes BIGINT DEFAULT 107374182400, -- 100 GB default
    used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS storage_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
    object_key VARCHAR(1024) NOT NULL,
    size_bytes BIGINT NOT NULL,
    etag VARCHAR(255),
    storage_class VARCHAR(50) DEFAULT 'STANDARD', -- STANDARD, NEARLINE, COLDLINE, ARCHIVE
    content_type VARCHAR(255) DEFAULT 'application/octet-stream',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bucket_id, object_key)
);

CREATE TABLE IF NOT EXISTS upload_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
    object_key VARCHAR(1024) NOT NULL,
    user_id UUID NOT NULL,
    total_bytes BIGINT NOT NULL,
    uploaded_bytes BIGINT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'INITIALIZED', -- INITIALIZED, IN_PROGRESS, COMPLETED, ABORTED, EXPIRED
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS multipart_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES upload_sessions(id) ON DELETE CASCADE,
    part_number INT NOT NULL,
    etag VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, part_number)
);

-- ----------------------------------------------------------------------------
-- 2. FILE MANAGEMENT MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL,
    path VARCHAR(2048) NOT NULL,
    color VARCHAR(50) DEFAULT '#3B82F6',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    extension VARCHAR(50),
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    storage_object_id UUID REFERENCES storage_objects(id) ON DELETE SET NULL,
    owner_id UUID NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum VARCHAR(128) NOT NULL, -- SHA-256
    file_type VARCHAR(50) NOT NULL, -- document, image, video, audio, code, archive, unknown
    is_favorite BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    trashed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    user_id UUID,
    group_id UUID,
    role VARCHAR(50) NOT NULL, -- viewer, editor, admin, owner
    granted_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_target CHECK ((file_id IS NOT NULL AND folder_id IS NULL) OR (file_id IS NULL AND folder_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    share_token VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    max_downloads INT,
    download_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, tag_name)
);

-- ----------------------------------------------------------------------------
-- 3. VERSION CONTROL MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS file_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    storage_object_id UUID NOT NULL REFERENCES storage_objects(id) ON DELETE RESTRICT,
    size_bytes BIGINT NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    comment TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, version_number)
);

CREATE TABLE IF NOT EXISTS version_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    version_id UUID NOT NULL REFERENCES file_versions(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- created, restored, deleted, purged
    performed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    tree_manifest JSONB NOT NULL, -- JSON snapshot of directory state
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rollback_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    snapshot_id UUID REFERENCES snapshots(id) ON DELETE SET NULL,
    from_version INT NOT NULL,
    to_version INT NOT NULL,
    reason TEXT,
    executed_by UUID NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. DOCUMENTS MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS document_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    title VARCHAR(512),
    author VARCHAR(255),
    page_count INT DEFAULT 0,
    word_count INT DEFAULT 0,
    language VARCHAR(50) DEFAULT 'en',
    created_date TIMESTAMP WITH TIME ZONE,
    modified_date TIMESTAMP WITH TIME ZONE,
    application VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extracted_text (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    full_text TEXT NOT NULL,
    clean_text TEXT NOT NULL,
    summary TEXT,
    layout_blocks JSONB, -- Coordinates & page blocks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS thumbnails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    size_label VARCHAR(50) NOT NULL, -- small, medium, large
    width INT NOT NULL,
    height INT NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    format VARCHAR(50) DEFAULT 'webp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS previews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    preview_url VARCHAR(1024) NOT NULL,
    format VARCHAR(50) DEFAULT 'png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_id, page_number)
);

-- ----------------------------------------------------------------------------
-- 5. MEDIA MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS media_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    duration_seconds FLOAT,
    width INT,
    height INT,
    aspect_ratio VARCHAR(20),
    codec VARCHAR(100),
    bitrate_bps BIGINT,
    frame_rate FLOAT,
    channels INT,
    sample_rate INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL, -- thumbnail, mobile, desktop, 4k
    width INT NOT NULL,
    height INT NOT NULL,
    format VARCHAR(50) NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    resolution VARCHAR(20) NOT NULL, -- 1080p, 720p, 480p, 360p
    bitrate_bps BIGINT NOT NULL,
    format VARCHAR(50) DEFAULT 'mp4',
    storage_path VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audio_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    artist VARCHAR(255),
    album VARCHAR(255),
    title VARCHAR(255),
    genre VARCHAR(100),
    track_number INT,
    duration_seconds FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 6. AI PROCESSING MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ocr_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    page_number INT DEFAULT 1,
    detected_text TEXT NOT NULL,
    confidence_score FLOAT DEFAULT 0.0,
    bounding_boxes JSONB,
    engine VARCHAR(100) DEFAULT 'Tesseract-v5',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transcriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'en',
    speaker_segments JSONB, -- Speaker diarisation
    model_used VARCHAR(100) DEFAULT 'Whisper-v3',
    confidence_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    vector JSONB NOT NULL, -- 1536-dim embedding vector array
    model VARCHAR(100) DEFAULT 'text-embedding-3-small',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    confidence FLOAT DEFAULT 0.9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moderation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    is_flagged BOOLEAN DEFAULT FALSE,
    nsfw_score FLOAT DEFAULT 0.0,
    violence_score FLOAT DEFAULT 0.0,
    hate_score FLOAT DEFAULT 0.0,
    pii_detected JSONB,
    status VARCHAR(50) DEFAULT 'PASSED', -- PASSED, FLAGGED, BLOCKED, REVIEW_REQUIRED
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS virus_scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    engine VARCHAR(100) DEFAULT 'ClamAV-v1.2',
    is_clean BOOLEAN DEFAULT TRUE,
    threat_found VARCHAR(255),
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. BACKUP MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    backup_type VARCHAR(50) DEFAULT 'FULL', -- FULL, INCREMENTAL, DIFFERENTIAL
    size_bytes BIGINT DEFAULT 0,
    storage_path VARCHAR(1024) NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS backup_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_id UUID REFERENCES backups(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS restore_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_id UUID NOT NULL REFERENCES backups(id) ON DELETE RESTRICT,
    target_folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, FAILED
    restored_files_count INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    retention_days INT NOT NULL DEFAULT 90,
    archive_after_days INT DEFAULT 30,
    delete_permanently BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. SECURITY MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS encryption_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_arn VARCHAR(512) NOT NULL,
    algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    is_active BOOLEAN DEFAULT TRUE,
    rotated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_checksums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID UNIQUE NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    md5 VARCHAR(32) NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    sha512 VARCHAR(128) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL, -- DOWNLOAD, VIEW, SHARE, DELETE, PERMISSION_CHANGE
    ip_address VARCHAR(50),
    user_agent VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS secure_deletion_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    wipe_method VARCHAR(100) DEFAULT 'DoD 5220.22-M 7-pass',
    verification_hash VARCHAR(128) NOT NULL,
    deleted_by UUID NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_owner_id ON files(owner_id);
CREATE INDEX IF NOT EXISTS idx_files_mime_type ON files(mime_type);
CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_file_versions_file_id ON file_versions(file_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage_objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_extracted_text_file_id ON extracted_text(file_id);
CREATE INDEX IF NOT EXISTS idx_ocr_results_file_id ON ocr_results(file_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_file_id ON embeddings(file_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_file_id ON access_logs(file_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
