import type { Ref } from 'vue'

interface ValidateCacheParams<T, Q, K> {
  ref: Ref<T | null>
  query: Q
  key: K
  loaderFn: { delete: (key: K) => void }
}

export const validateCache = <T, Q, K>({
  ref,
  query,
  key,
  loaderFn,
}: ValidateCacheParams<T, Q, K>) => {
  if (ref.value) {
    const finalQuery = typeof query === 'function' ? query(key) : query
    finalQuery.then(({ data, error }: { data: T; error: unknown }) => {
      if (JSON.stringify(ref.value) === JSON.stringify(data)) {
        return
      } else {
        loaderFn.delete(key)
        if (!error && data) {
          ref.value = data
        }
      }
    })
  }
}
