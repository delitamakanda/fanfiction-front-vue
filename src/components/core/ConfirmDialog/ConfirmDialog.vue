<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'
const { isRevealed, reveal, onReveal, confirm, cancel, onConfirm, onCancel } = useConfirmDialog()
const emit = defineEmits(['confirm'])
const open = ref(false)
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
})

onCancel(() => {
  console.log('Cancelled')
  open.value = false
})
onConfirm(() => {
  emit('confirm')
  console.log('Confirmed')
  open.value = false
})
onReveal(() => {
  open.value = true
})
</script>

<template>
  <ButtonLoader :label="props.label" @click="reveal" />
  <transition>
    <div class="modal relative z-10" v-show="open" :class="{ 'modal-open': isRevealed }">
      <div class="modal-box fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="modal-header mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
                >
                  <svg
                    class="size-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <div class="modal-body mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold text-gray-900" id="modal-title">
                    {{ props.label }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500" v-if="props.message">{{ props.message }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-action bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <ButtonLoader
                class="inline-flex w-full justify-center rounded-md px-3 py-2 sm:ml-3 sm:w-auto"
                @click="confirm"
                label="Confirm"
              />
              <ButtonLoader
                class="mt-3 inline-flex w-full justify-center px-3 py-2 sm:mt-0 sm:w-auto"
                @click="cancel"
                label="Cancel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
