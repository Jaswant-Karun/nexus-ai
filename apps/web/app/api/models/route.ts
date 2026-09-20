/**
 * GET /api/models
 *
 * Returns the full model catalog grouped by provider, including whether each
 * provider has an API key configured.  Used by the model selector UI.
 *
 * Response:
 *   {
 *     auto: true,
 *     providers: ProviderInfo[],
 *     allModels: ModelDef[]
 *   }
 */

import { NextResponse } from "next/server";
import { getProviders, getAllModels } from "@/lib/ai/config";

export const runtime = "nodejs";

export async function GET() {
  const providers = getProviders();
  const allModels = getAllModels();
  const anyAvailable = providers.some((p) => p.available);

  return NextResponse.json({
    auto: true, // Nexus Auto is always available as an option
    anyAvailable,
    providers,
    allModels,
  });
}
