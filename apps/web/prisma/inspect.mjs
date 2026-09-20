import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/nexus_ai",
});

const TABLES = [
  "Organization",
  "User",
  "Agent",
  "Workflow",
  "Conversation",
  "Message",
  "KnowledgeDocument",
  "StorageFolder",
  "StorageFile",
  "FileVersion",
  "FileShare",
  "AiProcessingJob",
  "AccessLog",
];

const DESCRIPTIONS = {
  Organization:      "Tenant / company. Every resource belongs to one org.",
  User:              "Platform users — email, bcrypt-hashed password, role.",
  Agent:             "AI agent definitions — model, system prompt, tools (JSON).",
  Workflow:          "Visual pipelines — nodes and edges stored as JSON arrays.",
  Conversation:      "Chat sessions linking a User to an Agent.",
  Message:           "Individual chat messages — role, content, tool calls.",
  KnowledgeDocument: "RAG knowledge-base docs — title, MIME, chunk count.",
  StorageFolder:     "Folder tree — supports nesting via parentId.",
  StorageFile:       "Uploaded file metadata — mime, checksum, AI insights.",
  FileVersion:       "Per-file version history for restore/rollback.",
  FileShare:         "Shareable links — permission, expiry, download limit.",
  AiProcessingJob:   "Background AI jobs — OCR, summarize, embed, transcribe.",
  AccessLog:         "Full audit trail of every file action (view/download…).",
};

for (const t of TABLES) {
  const cols = await pool.query(
    `SELECT column_name, data_type, is_nullable
     FROM information_schema.columns
     WHERE table_name = $1 AND table_schema = 'public'
     ORDER BY ordinal_position`,
    [t]
  );
  const cnt = await pool.query(`SELECT COUNT(*) FROM "${t}"`);
  const rows = parseInt(cnt.rows[0].count, 10);

  console.log(`\n┌─ ${t}  (${rows} row${rows !== 1 ? "s" : ""})`);
  console.log(`│  ${DESCRIPTIONS[t]}`);
  console.log(`│  ${"─".repeat(60)}`);
  console.log(`│  ${"Column".padEnd(26)}${"Type".padEnd(24)}Nullable`);
  console.log(`│  ${"─".repeat(60)}`);
  for (const c of cols.rows) {
    const nullable = c.is_nullable === "YES" ? "✓" : " ";
    console.log(`│  ${c.column_name.padEnd(26)}${c.data_type.padEnd(24)}${nullable}`);
  }
}

console.log("\n" + "═".repeat(64));
console.log("  ✅  Database: nexus_ai  |  13 tables  |  PostgreSQL 18.3");
console.log("  🔑  admin@nexus.ai  /  Admin@nexus123!");
console.log("  🔑  member@nexus.ai  /  Member@nexus123!");
console.log("═".repeat(64) + "\n");

await pool.end();
