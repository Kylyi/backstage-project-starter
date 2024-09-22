export type IServerValidationItem = {
  message: string
  code: string
  attributes: string[]
}

export type IServerValidation = {
  errors?: IServerValidationItem[]
  warnings?: IServerValidationItem[]
}
