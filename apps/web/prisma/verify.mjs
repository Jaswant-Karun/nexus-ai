import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:postgres@localhost:5432/nexus_ai",
});

const tables = [
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

const descriptions = {
  Organization:      "Company / tenant — name, slug, billing plan",
  User:              "Platform users — email, bcrypt hash, role, org",
  Agent:             "AI agents — model, system prompt, tools as JSON",
  Workflow:          "Visual pipelines — nodes + edges as JSON",
  Conversation:      "Chat sessions between user and agent",
  Message:           "Chat messages — role (user/assistant/system), content",
  KnowledgeDocument: "RAG docs — title, mime, chunk count, indexed size",
  StorageFolder:     "Folder tree — name, path, color, parentId",
  StorageFile:       "Files — mime, checksum, AI summary, keywords, tags",
  FileVersion:       "Version history — allows restore to any past version",
  FileShare:         "Share links — permission, expiry, download limit",
  AiProcessingJob:   "AI jobs — OCR, summarize, embed, transcribe, virus scan",
  AccessLog:         "Audit trail — every view/download/share/delete action",
};

let total = 0;

console.log("\n  ✅  PostgreSQL — nexus_ai — VERIFIED ROW COUNTS");
console.log("  " + "─".repeat(72));
console.log(
  "  " +
    "Table".padEnd(24) +
    "Rows".padStart(6) +
    "  " +
    "What is stored"
);
console.log("  " + "─".repeat(72));

for (const t of tables) {
  const r = await pool.query(`SELECT COUNT(*) FROM "${t}"`);
  const n = parseInt(r.rows[0].count, 10);
  total += n;
  console.log(
    "  " +
      t.padEnd(24) +
      String(n).padStart(6) +
      "  " +
      descriptions[t]
  );
}

console.log("  " + "─".repeat(72));
console.log(
  "  " + "TOTAL".padEnd(24) + String(total).padStart(6) + "  rows across all 13 tables"
);
console.log("\n  🔑  Login credentials:");
console.log("     Admin  → admin@nexus.ai    password: Admin@nexus123!");
console.log("     Member → member@nexus.ai   password: Member@nexus123!");
console.log("\n  🌐  API: GET /api/db/status  (requires auth cookie)\n");

await pool.end();
