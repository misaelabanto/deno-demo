import { serve } from 'https://deno.land/std@0.135.0/http/server.ts';
import { Router } from './types/router.ts';
import { UsersHandler } from './users/users.handler.ts';
import Parser from './lib/parser.ts';

const indexRouter: Router = {
	users: UsersHandler,
};

async function handler(req: Request): Promise<Response> {
	const url = new URL(req.url);
	const path = url.pathname.split('/')[1];
	console.log(path);
	const response = await indexRouter[path]?.(req);
	if (!response) {
		return Parser.parseBody(
			{
				code: 'NOT_FOUND',
			},
			{
				status: 404,
			}
		);
	}
	return response;
}

serve(handler, { port: 4242 });
