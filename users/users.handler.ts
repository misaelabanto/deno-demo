import { ACCEPTABLE_METHODS } from './users.constants.ts';
import Parser from '../lib/parser.ts';
import { Router } from '../types/router.ts';
import { Database } from '../lib/database.ts';
import { IUser } from './users.interface.ts';

const userRouter: Router = {
	async GET(): Promise<Response> {
		const users = await Database.collection('users').find<IUser>();
		return Parser.parseBody(users);
	},

  async POST(req: Request): Promise<Response> {
    const body = <IUser>await req.json();
    const userCreated = await Database.collection('users').insert<IUser>(body);
    return Parser.parseBody(userCreated, { status: 201 });
  }
};

export async function UsersHandler(req: Request): Promise<Response> {
	if (!ACCEPTABLE_METHODS.includes(req.method)) {
		return Parser.parseBody(
			{
				code: 'METHOD_NOT_ALLOWED',
			},
			{
				status: 405,
			}
		);
	}
	const response = await userRouter[req.method]?.(req);
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
