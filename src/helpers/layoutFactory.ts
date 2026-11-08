import { h } from 'vue'
import { useLayoutFactory } from '@/composables/useLayoutFactory'

interface LayoutFactoryOptions {
  LayoutComponent: any
  layoutComponents: any
  LAYOUTS: any
  defaultLayout: any
}
interface ComponentProps {
  [key: string]: any
}

export const layoutFactory = ({
  LayoutComponent,
  layoutComponents,
  LAYOUTS,
  defaultLayout,
}: LayoutFactoryOptions) => {
  const { useLayout } = useLayoutFactory({
    layoutComponents,
    LAYOUTS,
    defaultLayout,
  })

  const Component = (
    props: ComponentProps,
    { attrs, slots }: { attrs: any; slots: any },
  ): VNode => {
    const options = { useLayout, ...props, ...attrs }
    return h(LayoutComponent, options, slots)
  }

  return {
    LayoutComponent: Component,
    useLayout,
  }
}
