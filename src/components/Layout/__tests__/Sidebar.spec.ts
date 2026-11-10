import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { nextTick, ref } from 'vue'
import { menuKey } from '@/utils/injectionKeys'
import Sidebar from '../Sidebar.vue'

let wrapper: VueWrapper | undefined

const mountSidebar = (width: number) => {
  window.innerWidth = width
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:p(.*)*', component: { template: '<div />' } }],
  })
  const menuOpen = ref(false)
  wrapper = mount(Sidebar, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router],
      provide: {
        [menuKey as symbol]: { menuOpen, toggleMenu: () => (menuOpen.value = !menuOpen.value) },
      },
      stubs: { SidebarPanel: true, SidebarQuickActions: true },
    },
  })
  return { menuOpen, router }
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
})

describe('Sidebar', () => {
  it('is open by default on desktop and toggles aria-expanded', async () => {
    const { menuOpen } = mountSidebar(1280)
    await nextTick()

    expect(menuOpen.value).toBe(true)
    const button = wrapper!.get('button[aria-expanded]')
    expect(button.attributes('aria-expanded')).toBe('true')

    await button.trigger('click')
    expect(menuOpen.value).toBe(false)
    expect(wrapper!.get('button[aria-expanded]').attributes('aria-expanded')).toBe('false')
  })

  it('is closed by default below 1024px and renders no fixed sidebar', async () => {
    const { menuOpen } = mountSidebar(390)
    await nextTick()

    expect(menuOpen.value).toBe(false)
    expect(wrapper!.find('aside').exists()).toBe(false)
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })

  it('shows the drawer when opened and closes it after a navigation', async () => {
    const { menuOpen, router } = mountSidebar(390)
    menuOpen.value = true
    await nextTick()
    await nextTick()

    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.textContent).toContain('Menu')

    await router.push('/fanfics')
    expect(menuOpen.value).toBe(false)
  })
})
