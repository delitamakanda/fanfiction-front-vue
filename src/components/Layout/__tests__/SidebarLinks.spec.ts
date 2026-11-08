import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SidebarLinks from '../SidebarLinks.vue'
import { menuKey } from '@/utils/injectionKeys'

const links = [
  { title: 'Accueil', to: '/', icon: 'lucide:home' },
  { title: 'Se déconnecter', icon: 'lucide:log-out' },
]

const mountLinks = async (open: boolean) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push('/')
  await router.isReady()
  return mount(SidebarLinks, {
    props: { links },
    global: {
      plugins: [router],
      provide: { [menuKey as symbol]: { menuOpen: ref(open), toggleMenu: () => {} } },
    },
  })
}

describe('SidebarLinks', () => {
  it('keeps accessible names when the menu is collapsed', async () => {
    const wrapper = await mountLinks(false)
    const link = wrapper.get('a')

    expect(link.text()).toBe('Accueil')
    expect(link.get('span').classes()).toContain('sr-only')
    expect(link.attributes('aria-current')).toBe('page')
    expect(link.get('iconify-icon').attributes('aria-hidden')).toBe('true')
  })

  it('renders the sign out action as a real button that emits actionClicked', async () => {
    const wrapper = await mountLinks(true)
    const button = wrapper.get('button')

    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toBe('Se déconnecter')
    await button.trigger('click')
    expect(wrapper.emitted('actionClicked')?.[0]).toEqual(['Se déconnecter'])
  })
})
