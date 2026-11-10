import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AuthLayout from '../main/AuthLayout.vue'

describe('AuthLayout', () => {
  it('renders a single h1 with the page title, the main landmark and the slot', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    usePageStore().pageData.title = 'Fanfictions'

    const wrapper = mount(AuthLayout, {
      global: { plugins: [pinia], stubs: { Sidebar: true, TopNavbar: true, SkipLink: true } },
      slots: { default: '<p>Contenu</p>' },
    })

    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('h1').text()).toBe('Fanfictions')
    const main = wrapper.get('main#main-content')
    expect(main.classes()).toContain('page-container')
    expect(main.text()).toContain('Contenu')
  })
})
