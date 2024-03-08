import {reactive} from "vue";

const api = '/api/muyu'

type UpdateFn = (latest: number, old: number) => Promise<void>

const updateTasks: UpdateFn[] = []

export const onUpdate = (fn: UpdateFn) => { updateTasks.push(fn) }

const fetchCount = (): Promise<number> => fetch(api)
  .then(res => res.json())
  .then(data => data?.count ?? 0)
  .catch(() => 0)

export const uploadCount = (add: number) => {
  fetch(api, {
    method: "POST",
    body: JSON.stringify({count: add})
  })
}

export const state = reactive<{
  global: number
}>({
  global: 0
})

const updateCount = async () => {
  const latestCount = await fetchCount()
  if (latestCount !== state.global) {
    for (const task of updateTasks) {
      await task(latestCount, state.global)
    }
    state.global = latestCount
  }
}

const sleep = (n: number) => new Promise<void>(resolve => { setTimeout(resolve, n) })

export const updateLoop = async () => {
  while (true) {
    await updateCount()
    await sleep(1000)
  }
}
