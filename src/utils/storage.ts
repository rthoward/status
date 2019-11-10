import { propOr } from "ramda"

class Storage {
  data: object
  key = "__status_data__"

  constructor() {
    this.data = JSON.parse(localStorage.getItem(this.key) || "{}")
  }

  get(key: string, defaultValue?: any): any {
    return propOr(defaultValue, key, this.data)
  }

  set(key: string, value: object): void {
    this.data[key] = value
    localStorage.setItem(this.key, JSON.stringify(this.data))
  }
}

const storage = new Storage()

export default storage
