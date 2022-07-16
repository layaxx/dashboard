import {
  Ctx,
  getSession,
  MiddlewareRequest as Request,
  MiddlewareResponse as Response,
} from "blitz"
import httpMocks from "node-mocks-http"
import { User } from "db"

// This import is crucial, as it modifies global state by calling sessionMiddleware
// Most importantly, this sets the isAuthorized method in global.sessionConfig
import "../blitz.config"

interface CreateMockContextOptions {
  user?: User
  reqOptions?: httpMocks.RequestOptions
  resOptions?: httpMocks.ResponseOptions
  isAuthorized?: boolean
}

// Based on https://github.com/blitz-js/blitz/issues/2654#issuecomment-904426530
// Creates a mock context for use in tests and scripts. Attempts to make it the
// "real deal" by calling the same initialization logic that creates actual
// session contexts.
export default async function createMockContext<C extends Ctx>({
  user,
  reqOptions,
  resOptions,
  isAuthorized,
}: CreateMockContextOptions = {}) {
  const mocks = httpMocks.createMocks<any, any>(reqOptions, resOptions)
  const mockRequest: Request = mocks.req
  const mockResponse: Response<C> = mocks.res

  // Ensures the response has the blitzCtx object which is required for
  // authorization checks
  await getSession(mockRequest, mockResponse)

  // Simulate login by saving public session data
  if (user) {
    // Need to use Object.assign instead of spread operator,
    // because $publicData is readonly (only has a getter)
    // make sure to add **your** session's public data
    Object.assign(mockResponse.blitzCtx.session.$publicData, {
      userId: user.id,
      role: user.role,
      userName: user.name,
    })
  }

  if (isAuthorized) {
    // TODO: not sure why this is necessary
    Object.assign(mockResponse.blitzCtx.session, {
      $isAuthorized: () => true,
      $authorize: () => {},
    })
  }

  return { req: mockRequest, res: mockResponse, ctx: mockResponse.blitzCtx }
}
