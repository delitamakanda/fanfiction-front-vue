import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Carousel from '../Carousel.vue'

const elements = [
  { name: 'Romance', slug: 'romance', logic_value: 'romance', description: 'Histoires de coeur' },
  { name: 'Fantasy', slug: 'fantasy', logic_value: 'fantasy' },
  { name: 'Horreur', slug: 'horreur', logic_value: 'horreur' },
]

const mountCarousel = () => mount(Carousel, { props: { elements } })

describe('Carousel', () => {
  it('renders the first element with its category image', () => {
    const wrapper = mountCarousel()
    const image = wrapper.get('img')

    expect(wrapper.text()).toContain('Romance')
    expect(wrapper.text()).toContain('Histoires de coeur')
    expect(image.attributes('alt')).toBe('Romance')
    expect(image.attributes('src')).toContain('categories/romance.jpg')
  })

  it('moves to the next element', async () => {
    const wrapper = mountCarousel()

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.get('img').attributes('alt')).toBe('Fantasy')
    expect(wrapper.text()).toContain('Fantasy')
  })

  it('hides the description when the element has none', async () => {
    const wrapper = mountCarousel()

    await wrapper.findAll('button')[1].trigger('click')

    expect(wrapper.text()).not.toContain('Histoires de coeur')
  })

  it('exposes French accessible labels on the buttons', () => {
    const buttons = mountCarousel().findAll('button')

    expect(buttons[0].attributes('aria-label')).toBe('Catégorie précédente')
    expect(buttons[0].text()).toBe('Précédent')
    expect(buttons[1].attributes('aria-label')).toBe('Catégorie suivante')
    expect(buttons[1].text()).toBe('Suivant')
  })

  it('wraps around to the last element when going back from the first', async () => {
    const wrapper = mountCarousel()

    await wrapper.findAll('button')[0].trigger('click')

    expect(wrapper.get('img').attributes('alt')).toBe('Horreur')
  })
})
