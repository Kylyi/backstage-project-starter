// Config
import production from './production.json'
import local from './local.json'

const CONFIG_MAP = { production, local }

const environment: keyof typeof CONFIG_MAP = import.meta.env.NUXT_PUBLIC_ENV || 'local'
const BASE_CONFIG = CONFIG_MAP[environment]

export const SHARED_CONFIG = {
  // Session Timeout
  sessionTimeoutMinutes: BASE_CONFIG.sessionTimeoutMinutes,
}
