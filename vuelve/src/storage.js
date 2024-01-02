/*
export function storeGithubAccessTimeForUser (username, duration) {
  // get whole map..
  const storage = getMapOfGithubAccessTimesFromLocalStorage()

  // change just the entry we desier...
  storage[username] = duration

  // set the storage back
  setMapOfGithubAccessTimesToLocalStorage(storage)
}

export function getGithubAccessTimeForUser (username) {
  const storage = getMapOfGithubAccessTimesFromLocalStorage()

  return storage[username]
}

export function getPerformanceImprovementOnLastAccessTimeAsString (username, duration) {
  const prevDuration = getGithubAccessTimeForUser(username)

  if (!prevDuration) {
    return ''
  }

  try {
    const prevDurationValue = trimMillisec(prevDuration)
    const durationValue = trimMillisec(duration)

    return Math.ceil(prevDurationValue / durationValue)
  } catch (err) {
    return ''
  }
}

const LOCAL_STORAGE_KEY = 'key-for-local-storage-puzzle-pieces'

const getMapOfGithubAccessTimesFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {}
  } catch (err) {
    return {}
  }
}

const setMapOfGithubAccessTimesToLocalStorage = (storage) => {
  try {
    return localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage))
  } catch (err) {
    return {}
  }
}

const trimMillisec = (duration) => {
  if (!duration) {
    return 0
  } else {
    return +duration.slice(0, duration.length - 2)
  }
}
*/
