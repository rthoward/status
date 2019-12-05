import { keys, pick, forEachObjIndexed } from "ramda"

export const mapErrors = (validationSchema, errors, actions) => {
  if (errors.message) {
    actions.setStatus(errors.message)
  }
  const allowedKeys: any = keys(validationSchema.fields)
  const filtered = pick(allowedKeys, errors)
  forEachObjIndexed((value, key) => {
    actions.setFieldError(key, value.join(", "))
  }, filtered)
}
