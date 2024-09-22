// Types
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

export function useAppInit() {
  // Utils
  const userState = useCurrentUserState()

  async function init(account?: IAuthJwt) {
    const _account = account || userState.value

    // Whatever needs to be done on app init
  }

  return {
    init,
  }
}
