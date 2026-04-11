import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// CORS headers for admin API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SiteSettingsRow {
  key: string;
  value: unknown;
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("site_settings").select("*");

    if (error) {
      console.error("[Settings API] GET error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    const settings: Record<string, unknown> = {};
    (data as SiteSettingsRow[] | null)?.forEach((row) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json(settings, { headers: corsHeaders });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Settings API] GET exception:", errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("[Settings API] POST started");

    // Check Supabase connection first
    if (!supabase) {
      console.error("[Settings API] Supabase client not initialized");
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500, headers: corsHeaders }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
      console.log("[Settings API] Request body keys:", Object.keys(body));
    } catch (parseErr) {
      console.error("[Settings API] JSON parse error:", parseErr);
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Process each key
    for (const [key, value] of Object.entries(body)) {
      console.log(`[Settings API] Upserting key: ${key}`);

      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value }, { onConflict: "key" });

      if (error) {
        console.error(`[Settings API] Upsert error for key "${key}":`, error.message);
        return NextResponse.json(
          { success: false, error: `Database error: ${error.message}` },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // Revalidate cache
    try {
      revalidatePath("/", "layout");
      console.log("[Settings API] Cache revalidated");
    } catch (revalErr) {
      console.warn("[Settings API] Revalidation warning:", revalErr);
      // Don't fail the request if revalidation fails
    }

    console.log("[Settings API] POST completed successfully");
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Settings API] POST exception:", errorMsg);
    return NextResponse.json(
      { success: false, error: `Server error: ${errorMsg}` },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
