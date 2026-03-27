import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// One-time setup: create the news table if it doesn't exist
export async function GET() {
  try {
    // Try creating the table via RPC or raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.news (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          guid TEXT UNIQUE NOT NULL,
          source_id TEXT NOT NULL,
          region TEXT NOT NULL,
          title TEXT NOT NULL,
          link TEXT NOT NULL,
          published_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          summary JSONB,
          languages TEXT[] DEFAULT ARRAY['en']
        );
        ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Enable read for all') THEN
            CREATE POLICY "Enable read for all" ON public.news FOR SELECT TO public USING (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Enable insert for all') THEN
            CREATE POLICY "Enable insert for all" ON public.news FOR INSERT TO public WITH CHECK (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news' AND policyname = 'Enable update for all') THEN
            CREATE POLICY "Enable update for all" ON public.news FOR UPDATE TO public USING (true);
          END IF;
        END $$;
      `
    });

    if (error) {
      // RPC might not exist, return the SQL script for manual execution
      return NextResponse.json({
        success: false,
        message: "Auto-creation failed. Please run this SQL manually in Supabase SQL Editor:",
        sql: `CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guid TEXT UNIQUE NOT NULL,
  source_id TEXT NOT NULL,
  region TEXT NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  summary JSONB,
  languages TEXT[] DEFAULT ARRAY['en']
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all" ON public.news FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for all" ON public.news FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.news FOR UPDATE TO public USING (true);`,
        error: error.message,
      });
    }

    return NextResponse.json({ success: true, message: "News table created successfully!" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
