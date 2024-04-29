/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


/**
 * TODO: Make cors headers strict
 */

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "*",
	"Allow": "POST , OPTIONS"
}
  
const hasValidHeader = (request: Request, env: Env) => {
	return request.headers.get('X-Custom-Auth-Key') === env.AUTH_KEY_SECRET;
  };
  
function authorizeRequest(request: Request, env: Env) {
	if(request.method === "POST" && hasValidHeader(request, env)) {
		return true;
	}
	return false;
}


  function handleOptions(request: Request) {
	console.log("Handling OPTIONS request headers", request.headers.get("Origin"));
	console.log("Handling OPTIONS request headers", request.headers.get("Access-Control-Request-Method"));
	console.log("Handling OPTIONS request headers", request.headers.get("Access-Control-Request-Headers"));
	if (request.headers.get("Origin") !== null &&
		request.headers.get("Access-Control-Request-Method") !== null &&
		request.headers.get("Access-Control-Request-Headers") !== null) {
	  // Handle CORS pre-flight request.
	  console.log("RETURNING HEADERS FOR OPTIONS", corsHeaders)
	  return new Response(null, {
		headers: corsHeaders
	  })
	} else {
	  // Handle standard OPTIONS request.
	  return new Response(null, {
		headers: {
		  "Allow": "POST , OPTIONS",
		}
	  })
	}
  }

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			return handleOptions(request);
		}
		
		if (!authorizeRequest(request, env)) {
			return new Response('Forbidden', { status: 403 });
	    }
		const url = new URL(request.url);
    	const key = url.pathname.slice(1);

		if (request.method === "POST") {
			await env.COMMUNITY_BUCKET.put(key, request.body);
			return new Response(`POST ${key} successfully!`);
		} else {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: {
					...corsHeaders
				}});
		}
	},
};
