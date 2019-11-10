async function getUser() {
  return { user: "meow" }
}

async function bootstrapAppData() {
  const data = await getUser()
  const { user } = data
  return {
    user
  }
}

export { bootstrapAppData }
