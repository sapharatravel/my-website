// robots.txt follows the PROTOTYPE switch in src/lib/site.js
import { PROTOTYPE } from "../lib/site.js";
export const GET = () => new Response(PROTOTYPE ? "User-agent: *\nDisallow: /\n" : "User-agent: *\nAllow: /\nSitemap: https://sapharatravel.co.uk/sitemap.xml\n", { headers: { "Content-Type": "text/plain" } });
