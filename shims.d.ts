/// <reference types="vite/client" />

import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};
type XOR<T, U> = (T | U) extends Object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type OpenWindowFeatures = {
  popup?: boolean;
  noopener?: boolean;
  noreferrer?: boolean;
} & XOR<{
  width?: number;
}, {
  innerWidth?: number;
}> & XOR<{
  height?: number;
}, {
  innerHeight?: number;
}> & XOR<{
  left?: number;
}, {
  screenX?: number;
}> & XOR<{
  top?: number;
}, {
  screenY?: number;
}>;

type OpenOptions = {
  target: '_blank' | '_parent' | '_self' | '_top' | (string & {});
  windowFeatures?: OpenWindowFeatures;
}

export type NavigateToOptions = {
  replace?: boolean;
  redirectCode?: number;
  external?: boolean;
  open?: OpenOptions;
}

export default {}