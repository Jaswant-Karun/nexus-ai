/**
 * NEXUS AI — AI-Aware Intelligent Storage Engine Seed Script
 */

import { storageEngineRepo } from "../repositories/storage-repository";

export async function seedStorageEngine() {
  console.log("🌱 Seeding AI-Aware Intelligent Storage Engine Database...");

  // 1. Root Folders
  const docsFolder = await storageEngineRepo.createFolder({
    name: "Documents & Specs",
    ownerId: "usr_admin_001",
    path: "/Documents & Specs",
    color: "#3B82F6",
    isArchived: false,
  });

  const mediaFolder = await storageEngineRepo.createFolder({
    name: "Media & Assets",
    ownerId: "usr_admin_001",
    path: "/Media & Assets",
    color: "#8B5CF6",
    isArchived: false,
  });

  // 2. Sample Files
  const pdfFile = await storageEngineRepo.createFile({
    name: "NEXUS_AI_Architecture_Spec.pdf",
    extension: "pdf",
    folderId: docsFolder.id,
    ownerId: "usr_admin_001",
    mimeType: "application/pdf",
    sizeBytes: 4521098,
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    fileType: "DOCUMENT",
    isFavorite: true,
    isTrashed: false,
  });

  const codeFile = await storageEngineRepo.createFile({
    name: "storage_engine.ts",
    extension: "ts",
    folderId: docsFolder.id,
    ownerId: "usr_admin_001",
    mimeType: "text/typescript",
    sizeBytes: 12480,
    checksum: "8f4e3c2b1a0d9e8f7c6b5a4d3c2b1a0d9e8f7c6b5a4d3c2b1a0d9e8f7c6b5a4d",
    fileType: "CODE",
    isFavorite: false,
    isTrashed: false,
  });

  const audioFile = await storageEngineRepo.createFile({
    name: "project_kickoff_recording.mp3",
    extension: "mp3",
    folderId: mediaFolder.id,
    ownerId: "usr_admin_001",
    mimeType: "audio/mpeg",
    sizeBytes: 18450920,
    checksum: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    fileType: "AUDIO",
    isFavorite: false,
    isTrashed: false,
  });

  // 3. File Versions
  await storageEngineRepo.createVersion({
    fileId: pdfFile.id,
    versionNumber: 1,
    storageObjectId: "obj_v1_001",
    sizeBytes: 4200000,
    checksum: "abc123v1checksum",
    comment: "Initial draft specification",
    createdBy: "usr_admin_001",
  });

  await storageEngineRepo.createVersion({
    fileId: pdfFile.id,
    versionNumber: 2,
    storageObjectId: "obj_v2_002",
    sizeBytes: 4521098,
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    comment: "Added AI-Aware Storage Engine architecture section",
    createdBy: "usr_admin_001",
  });

  // 4. AI Vector Embeddings
  await storageEngineRepo.addEmbeddings(pdfFile.id, [
    {
      text: "The AI-Aware Intelligent Storage Engine automatically extracts metadata, entities, and semantic vector embeddings.",
      vector: Array.from({ length: 1536 }, () => (Math.random() - 0.5) * 0.1),
    },
    {
      text: "Every file uploaded is linked into a unified knowledge graph connecting conversations, workflows, and projects.",
      vector: Array.from({ length: 1536 }, () => (Math.random() - 0.5) * 0.1),
    },
  ]);

  // 5. File Shares
  const share = await storageEngineRepo.createShare(pdfFile.id, "usr_admin_001");

  console.log("✅ Seed completed successfully!");
  console.log(`📁 Folders created: ${docsFolder.name}, ${mediaFolder.name}`);
  console.log(`📄 Files created: ${pdfFile.name}, ${codeFile.name}, ${audioFile.name}`);
  console.log(`🔗 Public Share Token: ${share.shareToken}`);

  return { docsFolder, mediaFolder, pdfFile, codeFile, audioFile, share };
}

seedStorageEngine().catch(console.error);
