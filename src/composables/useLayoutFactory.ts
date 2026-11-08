import { ref, computed } from 'vue'
import type { Component } from 'vue'

export interface LayoutFactoryConfig<L> {
  layoutComponents: Record<symbol, Component>
  LAYOUTS: L
  defaultLayout: symbol
}

export const useLayoutFactory = <L>({
  layoutComponents,
  LAYOUTS,
  defaultLayout,
}: LayoutFactoryConfig<L>) => {
  const layout = ref(defaultLayout)

  const currentLayoutComponent = computed(() => layoutComponents[layout.value])

  const setLayout = (layoutType: symbol) => {
    layout.value = layoutType
  }

  const useLayout = () => {
    return {
      currentLayoutComponent,
      layout,
      setLayout,
      LAYOUTS,
    }
  }

  return {
    useLayout,
  }
}
