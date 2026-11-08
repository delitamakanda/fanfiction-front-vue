import { h } from 'vue'
import type { Component as VueComponent, SetupContext } from 'vue'
import { useLayoutFactory } from '@/composables/useLayoutFactory'
import type { LayoutFactoryConfig } from '@/composables/useLayoutFactory'

interface LayoutFactoryOptions<L> extends LayoutFactoryConfig<L> {
  LayoutComponent: VueComponent
}
type ComponentProps = Record<string, unknown>

export const layoutFactory = <L>({
  LayoutComponent,
  layoutComponents,
  LAYOUTS,
  defaultLayout,
}: LayoutFactoryOptions<L>) => {
  const { useLayout } = useLayoutFactory({
    layoutComponents,
    LAYOUTS,
    defaultLayout,
  })

  const Component = (
    props: ComponentProps,
    { attrs, slots }: Pick<SetupContext, 'attrs' | 'slots'>,
  ): VNode => {
    const options = { useLayout, ...props, ...attrs }
    return h(LayoutComponent, options, slots)
  }

  return {
    LayoutComponent: Component,
    useLayout,
  }
}
