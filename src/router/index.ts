import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

const homepageModules = import.meta.glob(
  './modules/**/homepage.ts',
  {eager: true}
)

const fixedModules = import.meta.glob(
  './modules/**/!(homepage).ts',
  {eager: true}
)

const defaultRouterList: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  }
]

const flatRouterModule = (moduleRecord: Record<string, unknown>) => {
  const routerList: RouteRecordRaw[] = []
  const keys = Object.keys(moduleRecord)

  for (const key of keys) {
    const mod = Reflect.get(moduleRecord, key)

    if (typeof mod === 'object' && mod !== null) {
      const defaultExports = Reflect.get(mod, 'default')
      if (defaultExports !== undefined) {
        if (Array.isArray(defaultExports)) {
          routerList.push(...defaultExports)
        } else {
          routerList.push(defaultExports)
        }
      }
    }
  }

  return routerList
}

const homepageRouterList = flatRouterModule(homepageModules)
const fixedRouterList = flatRouterModule(fixedModules)

export const allRoutes: RouteRecordRaw[] = [
  ...homepageRouterList,
  ...fixedRouterList,
  ...defaultRouterList,
]

const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
})

export default router
