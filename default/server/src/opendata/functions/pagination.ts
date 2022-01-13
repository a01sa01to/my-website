const generateCursor = (data: any) => {
  const cursor = Buffer.from(JSON.stringify(data)).toString('base64')
  return cursor
}

const applyCursorsToData = (
  allData: any[],
  before?: string,
  after?: string
) => {
  const data = allData.concat()
  if (after) {
    const afterData = JSON.parse(Buffer.from(after, 'base64').toString())
    const afterIndex = allData.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(afterData)
    )
    if (afterIndex >= 0) data.splice(0, afterIndex + 1)
  }
  if (before) {
    const beforeData = JSON.parse(Buffer.from(before, 'base64').toString())
    const beforeIndex = allData.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(beforeData)
    )
    if (beforeIndex >= 0) data.splice(beforeIndex)
  }
  return data
}

const dataToReturn = (
  allData: any[],
  before?: string,
  after?: string,
  first?: number,
  last?: number
) => {
  const data = applyCursorsToData(allData, before, after)
  if (first) {
    if (first < 0) throw new Error('first must be greater than 0')
    if (data.length < first) {
      // do nothing
    } else {
      data.splice(first)
    }
  }
  if (last) {
    if (last < 0) throw new Error('last must be greater than 0')
    if (data.length < last) {
      // do nothing
    } else {
      data.splice(0, data.length - last)
    }
  }
  return data
}

const hasPreviousPage = (
  allData: any[],
  before?: string,
  after?: string,
  last?: number
) => {
  if (last) {
    let data = applyCursorsToData(allData, before, after)
    if (data.length > last) return true
    else return false
  }
  if (after) return true
  return false
}

const hasNextPage = (
  allData: any[],
  before?: string,
  after?: string,
  first?: number
) => {
  console.log(first)
  if (first) {
    let data = applyCursorsToData(allData, before, after)
    if (data.length > first) return true
    else return false
  }
  if (before) return true
  return false
}

type PaginationArg = {
  before?: string
  after?: string
  first?: number
  last?: number
}

type PaginationReturnType = {
  data: any[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  startCursor: string
  endCursor: string
}

const PaginationFn = (
  allData: any[],
  last_update: string | null,
  before?: string,
  after?: string,
  first?: number,
  last?: number
) => {
  const data = dataToReturn(allData, before, after, first, last)
  const hasPrevious = hasPreviousPage(allData, before, after, last)
  const hasNext = hasNextPage(allData, before, after, first)
  const startCursor = generateCursor(data[0])
  const endCursor = generateCursor(data[data.length - 1])
  return {
    dataset: data,
    pageinfo: {
      hasPreviousPage: hasPrevious,
      hasNextPage: hasNext,
      startCursor,
      endCursor,
    },
    last_update,
  }
}

const PageInfoScheme = `
  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String!
    endCursor: String!
  }
`

export { PaginationArg, PaginationFn, PaginationReturnType, PageInfoScheme }
