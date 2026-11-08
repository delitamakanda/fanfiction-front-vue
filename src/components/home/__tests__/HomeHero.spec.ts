import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeHero from '../HomeHero.vue'

const mountHero = (isAuthenticated: boolean) =>
  mount(HomeHero, {
    props: { isAuthenticated },
    global: { stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } },
  })

describe('HomeHero', () => {
  it('shows a single h1 and the sign-up / login links for visitors', () => {
    const wrapper = mountHero(false)

    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('a[href="/register"]').text()).toBe('Créer un compte')
    expect(wrapper.get('a[href="/login"]').text()).toBe('Se connecter')
  })

  it('shows the explore link instead for signed-in users', () => {
    const wrapper = mountHero(true)

    expect(wrapper.findAll('h1')).toHaveLength(0)
    expect(wrapper.get('a[href="/fanfics"]').text()).toBe('Explorer les fanfics')
    expect(wrapper.find('a[href="/register"]').exists()).toBe(false)
  })
})
