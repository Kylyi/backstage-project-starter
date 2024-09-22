// Types
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

// App
export const useLastAccessedPageState = () => useState<string | null>('lastAccessedPage', () => null)

// Auth
export const useCurrentUserState = () => useState<IAuthJwt | null>('account', () => null)
