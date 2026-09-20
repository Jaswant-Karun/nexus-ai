import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface ApiTokenRecord {
  id: string;
  name: string;
  prefix: string;
  secret?: string;
  scope: string;
  created: string;
  lastUsed: string;
}

// In-memory persistent token registry with realistic enterprise defaults
let tokenStore: ApiTokenRecord[] = [
  {
    id: "tok_prod_01",
    name: "Production Worker Key",
    prefix: "nx_live_99fa****************",
    secret: "nx_live_99fa84c20e11894b9aa102848c",
    scope: "Full Access (Read/Write)",
    created: "Today, 10:24 AM",
    lastUsed: "4 mins ago",
  },
  {
    id: "tok_stage_02",
    name: "Staging CI/CD Pipeline",
    prefix: "nx_test_41ca****************",
    secret: "nx_test_41ca27b878201a09d37449a11",
    scope: "Agent Dispatch Only",
    created: "Yesterday, 3:15 PM",
    lastUsed: "1 hour ago",
  },
  {
    id: "tok_mobile_03",
    name: "Nexus Mobile Client",
    prefix: "nx_live_77be****************",
    secret: "nx_live_77be312a0d99ef87b4112c33",
    scope: "Mobile & Agent Telemetry",
    created: "Sep 12, 2026",
    lastUsed: "Just now",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    tokens: tokenStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || "Generated Access Token";
    const scope = body.scope?.trim() || "Full Access (Read/Write)";

    const rawHex = crypto.randomBytes(16).toString("hex");
    const secret = `nx_live_${rawHex}`;
    const prefix = `nx_live_${rawHex.substring(0, 4)}****************`;

    const newToken: ApiTokenRecord = {
      id: `tok_${Date.now()}`,
      name,
      prefix,
      secret,
      scope,
      created: "Just now",
      lastUsed: "Never",
    };

    tokenStore = [newToken, ...tokenStore];

    return NextResponse.json({
      success: true,
      token: newToken,
      message: "API token generated successfully. Store it safely.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Token ID required" }, { status: 400 });
    }
    tokenStore = tokenStore.filter((t) => t.id !== id);
    return NextResponse.json({ success: true, message: "Token revoked successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to revoke token" }, { status: 500 });
  }
}
