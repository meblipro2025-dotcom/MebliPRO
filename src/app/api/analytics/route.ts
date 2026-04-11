import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface AnalyticsEvent {
  event_type: string;
  referrer?: string;
  source?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalyticsEvent;
    const { event_type, referrer, source } = body;

    const { error } = await supabase
      .from("site_events")
      .insert([{ event_type, referrer, source }]);

    if (error) {
      console.error("Analytics insert error:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("site_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
