export type RawBody = unknown | unknown[];

export default {
	parseBody(body: RawBody, init?: ResponseInit) {
		const response = new Response(JSON.stringify(body), {
			status: init?.status || 200,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				...(init?.headers || {})
			},
		});
		return Promise.resolve(response)
	}
}
