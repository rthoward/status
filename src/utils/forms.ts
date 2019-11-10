import { forEachObjIndexed } from "ramda"

export const mapErrors = (errors, actions) => {
  forEachObjIndexed((value, key) => {
    console.log(value, key)
    actions.setFieldError(key, value.join(", "))
  }, errors)
}
