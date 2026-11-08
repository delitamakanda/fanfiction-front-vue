import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TopNavbar from '../TopNavbar.vue'

const mountNavbar = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(TopNavbar, { global: { plugins: [pinia] } })
}

describe('TopNavbar', () => {
  it('exposes a labelled navigation and search form', () => {
    const wrapper = mountNavbar()

    expect(wrapper.get('nav').attributes('aria-label')).toBe("Barre d'outils")
    expect(wrapper.get('form').attributes('role')).toBe('search')
    const input = wrapper.get('input')
    expect(wrapper.get(`label[for="${input.attributes('id')}"]`).text()).toBe('Rechercher')
    expect(input.attributes('placeholder')).toBe('Rechercher…')
  })

  it('gives the theme button an accessible name', () => {
    const wrapper = mountNavbar()

    expect(wrapper.get('button').attributes('aria-label')).toMatch(/Passer en thème/)
  })

  it('does not reload the page when the search is submitted', async () => {
    const wrapper = mountNavbar()
    const event = new Event('submit', { cancelable: true })

    wrapper.get('form').element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })
})
