import { ref, computed } from 'vue'

export const useLayoutFactory = ({ layoutComponents, LAYOUTS, defaultLayout }: any) => {
  const layout = ref(defaultLayout)

  const currentLayoutComponent = computed(() => layoutComponents[layout.value])

  const setLayout = (layoutType: any) => {
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
