export type ResponseLike = Response | Promise<Response>

export type HTTPHandler = (req: Request) => ResponseLike

export type Router = Record<string, HTTPHandler>