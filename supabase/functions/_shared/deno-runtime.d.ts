/**
 * Local editor support for the Deno globals supplied by Supabase Edge Functions.
 * These declarations are type-only and do not ship a runtime polyfill.
 */
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }

  function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): void;
}

declare module "npm:@supabase/supabase-js@2.116.0" {
  export * from "@supabase/supabase-js";
}
