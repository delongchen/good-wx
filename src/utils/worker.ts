type ResultResolver = (result: any) => void

interface TaskCmd {
  key: string
  arg?: any
}

interface TaskOptions {
  timeout?: number
}

export const useWxWebWorkerProtocolMain = (worker: Worker) => {
  const taskMap: Map<number, ResultResolver> = new Map
  const originMessageHandler = worker.onmessage
  let available = true

  const messageHandler = (ev: MessageEvent<any>) => {
    const data = ev.data
    if (typeof data !== 'object') return

    const {key, id, result} = data
    if (typeof key !== 'string' || typeof id !== 'number') return

    clearTimeout(id)

    const resolver = taskMap.get(id)
    if (resolver !== undefined) {
      resolver(result)
      taskMap.delete(id)
    }
  }

  const invokeTask = <T>(cmd: TaskCmd, opts?: TaskOptions): Promise<T> => {
    if (!available) return Promise.reject()

    const { key, arg } = cmd
    const {
      timeout = 5000
    } = opts ?? {}

    return new Promise((resolve, reject) => {
      const id = window.setTimeout(() => {
        taskMap.delete(id)
        reject()
      }, timeout)

      taskMap.set(id, resolve)

      worker.postMessage({id, key, arg})
    })
  }

  const stop = () => {
    worker.onmessage = originMessageHandler
    available = false
  }

  worker.onmessage = messageHandler

  return {
    worker,
    invokeTask,
    stop,
  }
}

type CmdHandler = (arg: any) => Promise<any>

export const useWxWebWorkerProtocolWorker = () => {
  const handlerMap: Map<string, CmdHandler> = new Map

  const registerHandler = (key: string, handler: CmdHandler) => {
    handlerMap.set(key, handler)
  }

  const messageHandler = (ev: MessageEvent) => {
    const { data } = ev

    if (typeof data !== 'object') return

    const {key, id, arg} = data

    if (
      typeof key !== 'string' ||
      typeof id !== "number"
    ) return

    const handler = handlerMap.get(key)
    if (handler === undefined) return

    handler(arg).then((result) => {
      postMessage({key, id, result})
    })
  }

  return {
    messageHandler,
    registerHandler,
  }
}
