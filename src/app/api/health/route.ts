import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Diagnostics {
  timestamp: string;
  environment: string;
  env: {
    hasSupabaseUrl: boolean;
    hasSupabaseAnonKey: boolean;
    hasSupabaseServiceKey: boolean;
    supabaseUrl: string;
  };
  supabase: {
    connected: boolean;
    responseTime?: string;
    error: string | null;
    rowCount?: number;
  };
  runtime: {
    nodeVersion: string;
    platform: string;
  };
}

export async function GET() {
  const diagnostics: Diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...` 
        : "NOT SET",
    },
    supabase: {
      connected: false,
      error: null,
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
    },
  };

  // Test Supabase connection
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from("site_settings")
      .select("count(*)", { count: "exact", head: true });
    
    const responseTime = Date.now() - startTime;
    
    diagnostics.supabase = {
      connected: !error,
      responseTime: `${responseTime}ms`,
      error: error ? error.message : null,
      rowCount: data?.length ?? 0,
    };
  } catch (err) {
    diagnostics.supabase = {
      connected: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }

  const allOk = diagnostics.env.hasSupabaseUrl && 
                diagnostics.env.hasSupabaseAnonKey && 
                diagnostics.supabase.connected;

  return NextResponse.json(diagnostics, {
    status: allOk ? 200 : 503,
  });
}
