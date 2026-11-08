import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia, defineStore, storeToRefs } from 'pinia'
import { defineComponent, h, ref, Suspense } from 'vue'
import { useMemoize } from '@vueuse/core'
import RecentFanfics from '../RecentFanfics.vue'
import { fetchFanfics } from '@/utils/apiFanfics'

vi.mock('@/utils/apiFanfics', () => ({
  fetchFanfics: vi.fn(),
  fetchFanfic: vi.fn(),
}))

const fanfic = (id: number) => ({
  id,
  slug: `fanfic-${id}`,
  title: `Fanfic ${id}`,
  category: 'Livres',
  author: 'auteur',
})

const page = (results: ReturnType<typeof fanfic>[]) =>
  ({
    data: { count: results.length, next: '', previous: '', results },
    error: null,
    status: 200,
  }) as never

const mountSuspended = async () => {
  const { useFanficsStore } = await import('@/stores/loaders/fanfics')
  // Les auto-imports (unplugin) ne sont pas actifs dans ce test : on les expose.
  Object.assign(globalThis, { useFanficsStore })
  const wrapper = mount(
    defineComponent({ render: () => h(Suspense, null, { default: () => h(RecentFanfics) }) }),
    {
      global: {
        stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
        components: {
          ButtonLoader: defineComponent({
            emits: ['click'],
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          }),
        },
      },
    },
  )
  await flushPromises()
  return wrapper
}

describe('RecentFanfics', () => {
  beforeEach(() => {
    Object.assign(globalThis, { defineStore, storeToRefs, ref, useMemoize })
    setActivePinia(createPinia())
    vi.resetModules()
    vi.mocked(fetchFanfics).mockReset()
  })

  it('renders the cards and requests published fanfics, newest first', async () => {
    vi.mocked(fetchFanfics).mockResolvedValue(page([fanfic(1), fanfic(2)]))
    const wrapper = await mountSuspended()

    expect(wrapper.text()).toContain('Fanfic 1')
    expect(wrapper.text()).toContain('Fanfic 2')
    expect(fetchFanfics).toHaveBeenCalledWith({
      q: 'publié',
      ordering: '-created',
      page_size: 8,
    })
  })

  it('shows the empty message', async () => {
    vi.mocked(fetchFanfics).mockResolvedValue(page([]))
    const wrapper = await mountSuspended()

    expect(wrapper.text()).toContain('Aucun fanfic publié pour le moment.')
  })

  it('shows an error with a retry button that reloads the list', async () => {
    vi.mocked(fetchFanfics).mockRejectedValueOnce(new Error('network'))
    const wrapper = await mountSuspended()

    expect(wrapper.get('[role="alert"]').text()).toContain('Réessayer')

    vi.mocked(fetchFanfics).mockResolvedValue(page([fanfic(3)]))
    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Fanfic 3')
  })
})
