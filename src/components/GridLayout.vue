<template>
  <div class="gridLayout">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style>
.gridLayout {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  @apply gap-8 grid;
}
</style>
