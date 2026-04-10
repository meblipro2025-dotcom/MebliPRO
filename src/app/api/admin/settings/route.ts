import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface SiteSettingsRow {
  key: string;
  value: unknown;
}

export async function GET() {
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, unknown> = {};
  (data as SiteSettingsRow[] | null)?.forEach((row) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;

  for (const [key, value] of Object.entries(body)) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) {
      console.error(`Settings upsert error for key "${key}":`, error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
