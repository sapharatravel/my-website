import ICONS from "../../data/icons.json";

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(ICONS), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
