import { keys, pick, forEachObjIndexed } from "ramda"

export const mapErrors = (validationSchema, errors, actions) => {
  const allowedKeys: any = keys(validationSchema.fields)
  const filtered = pick(allowedKeys, errors)
  forEachObjIndexed((value, key) => {
    actions.setFieldError(key, value.join(", "))
  }, filtered)
}
