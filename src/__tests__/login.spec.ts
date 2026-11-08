import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '@/pages/login.vue'

const login = vi.fn()
vi.mock('@/utils/apiAuth', () => ({ login: (...args: unknown[]) => login(...args) }))

const mountLogin = async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:p(.*)*', component: { template: '<div />' } }],
  })
  await router.push('/login')
  await router.isReady()
  return mount(Login, { global: { plugins: [router] }, attachTo: document.body })
}

describe('login page', () => {
  beforeEach(() => login.mockReset())

  it('links labels to their fields', async () => {
    const wrapper = await mountLogin()
    const username = wrapper.get('input#username')
    const password = wrapper.get('input#password')

    expect(wrapper.get('label[for="username"]').text()).toBe("Nom d'utilisateur")
    expect(wrapper.get('label[for="password"]').text()).toBe('Mot de passe')
    expect(username.attributes('autocomplete')).toBe('username')
    expect(password.attributes('autocomplete')).toBe('current-password')
    expect(wrapper.findAll('h1')).toHaveLength(1)
  })

  it('announces the server error and flags the fields as invalid', async () => {
    login.mockResolvedValue({ error: { response: { data: { detail: 'Identifiants invalides' } } } })
    const wrapper = await mountLogin()

    await wrapper.get('input#username').setValue('demo-reader')
    await wrapper.get('input#password').setValue('wrong')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const alert = wrapper.get('[role="alert"]')
    expect(alert.text()).toContain('Identifiants invalides')
    expect(wrapper.get('input#username').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input#password').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('input#password').attributes('aria-describedby')).toContain(
      alert.attributes('id'),
    )
  })
})
