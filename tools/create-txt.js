const { z } = require("zod");
const api = require("../lib/api-client");

module.exports = function registerCreateTxt(server, apiKey) {
  server.tool(
    "create_txt_record",
    "Create or update a TXT record for domain verification. Used for services like Vercel (_vercel) and Netlify that require DNS-based ownership proof. Set root_level=true for services like Vercel that check TXT at the apex (e.g. _vercel.sitey.one instead of _vercel.demo.sitey.one).",
    {
      subdomain: z.string().describe("Subdomain name (e.g. 'demo')"),
      domain: z.string().describe("Root domain (e.g. 'sitey.one')"),
      host_prefix: z.string().describe("TXT record host prefix (e.g. '_vercel' for Vercel verification)"),
      value: z.string().describe("TXT record value (the verification token)"),
      root_level: z.boolean().optional().describe("If true, place TXT at root level (e.g. _vercel.sitey.one) instead of subdomain level (e.g. _vercel.demo.sitey.one). Required for Vercel domain verification."),
    },
    async ({ subdomain, domain, host_prefix, value, root_level }) => {
      try {
        const data = await api.post(
          `/subdomains/${subdomain}/${domain}/txt`,
          { host_prefix, value, root_level: root_level || false },
          apiKey
        );
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return { content: [{ type: "text", text: err.message || "Failed to create TXT record" }], isError: true };
      }
    }
  );
};
