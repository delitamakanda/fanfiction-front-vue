import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GuestLayout from '../main/GuestLayout.vue'

describe('GuestLayout', () => {
  it('has a single focusable main landmark and a skip link targeting it', () => {
    const wrapper = mount(GuestLayout, { slots: { default: '<p>Contenu</p>' } })

    expect(wrapper.findAll('main')).toHaveLength(1)
    const main = wrapper.get('main')
    expect(main.attributes('id')).toBe('main-content')
    expect(main.attributes('tabindex')).toBe('-1')
    expect(main.text()).toContain('Contenu')
    const skip = wrapper.get('a[href="#main-content"]')
    expect(skip.text()).toBe('Aller au contenu principal')
  })

  it('moves focus to main when the skip link is activated', async () => {
    const wrapper = mount(GuestLayout, { attachTo: document.body })

    await wrapper.get('a[href="#main-content"]').trigger('click')

    expect(document.activeElement).toBe(wrapper.get('main').element)
    wrapper.unmount()
  })
})
