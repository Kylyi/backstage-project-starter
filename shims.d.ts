/// <reference types="vite/client" />

import type { IQueryBuilderRow } from '~/components/QueryBuilder/types/query-builder-row-props.type'
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'
import type { prisma } from '~/server/prisma'

export type IBoardLayoutSchema = {
  columnsSelection?: number[]
  tagsFilter?: number[]
  usersFilter?: number[]
  tasksQueryBuilder?: IQueryBuilderRow[]
  taskFields?: string[]
  useAdvancedFilter?: boolean
  useUsersFilter?: boolean
  useTagsFilter?: boolean
}

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

declare module 'h3' {
  interface H3EventContext {
    auth?: IAuthJwt | null
    instanceId?: number
    prisma: typeof prisma
  }
}

// Prisma JSON types
declare global {
  namespace PrismaJson {
    type IStyle = IItem
    type JsonValue = IItem
    type IBoardLayoutSchema = IBoardLayoutSchema
    type IWorkflowCondition = IItem
    type IWorkflowAction = IItem
  }
}

export default {}