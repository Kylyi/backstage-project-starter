import _axios, { type AxiosInstance } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { config } from '~/components/config/components-config'

export const axios = _axios.create({
  baseURL: config.apiRoot,
  headers: {
    common: {
      'Content-Type': 'application/json',
    },
  },
})

export function refreshToken() {
  return axios({
    method: 'GET',
    url: 'security/login/refresh',
    headers: {
      'X-With-Refresh-Token': `Bearer ${useCookie('_refreshToken').value}`,
    },
  })
}

function useInterceptors(instance: AxiosInstance, nuxtApp: any) {
  instance.interceptors.request.use(
    config => {
      // @ts-expect-error
      config._requestData = config.data
      config.headers = config.headers || {}

      let acceptLanguage: string | undefined
      const isSrCyr = nuxtApp.$i18n.locale.value === 'sr-Cyrl'
      const isSrLat = nuxtApp.$i18n.locale.value === 'sr'

      if (isSrCyr) {
        acceptLanguage = 'sr-Cyrl'
      } else if (isSrLat) {
        acceptLanguage = 'sr-Latn'
      }

      config.headers['Accept-Language'] = acceptLanguage
      const _accessToken = useCookie('_accessToken').value

      if (config.headers['X-With-Refresh-Token']) {
        config.headers.Authorization = config.headers['X-With-Refresh-Token']
      } else if (_accessToken) {
        config.headers.Authorization = `Bearer ${_accessToken}`
      }

      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    response => {
      return response
    },
    async error => {
      const originalConfig = error.config

      if (
        (error.response?.status === 401)
        && !originalConfig._retry
        && !originalConfig.url.toLowerCase().endsWith('login/refresh')
      ) {
        originalConfig._retry = true

        const accessTokenCookie = useCookie('_accessToken')
        const refreshTokenCookie = useCookie('_refreshToken')

        if (refreshTokenCookie.value) {
          const { data } = await refreshToken()

          if (data?.payload) {
            accessTokenCookie.value = data.payload.accessToken

            useCurrentUserState().value = jwtDecode(data.payload.accessToken)
          } else {
            accessTokenCookie.value = null
            refreshTokenCookie.value = null

            return Promise.reject(error)
          }
        } else {
          return Promise.reject(error)
        }

        return instance(originalConfig)
      }

      return Promise.reject(error)
    },
  )
}

export function initializeAxios(nuxtApp: any) {
  useInterceptors(axios, nuxtApp)
}
