import type { ColumnDef } from '@tanstack/vue-table'
import type { Post } from '../apiPost'
import { RouterLink } from 'vue-router'
import type { GroupedCollabs } from '@/types/GroupedCollabs.ts'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import { formatDate } from '@/utils/formatDates'

export const columns = (_collabs: Ref<GroupedCollabs>): ColumnDef<Post>[] => [
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-left' }, 'Title'),
    cell: ({ row }) => {
      return h(
        RouterLink,
        {
          to: `/posts/${row.original.slug}`,
          class: 'text-left font-medium hover:bg-muted block w-full',
        },
        () => row.getValue('title'),
      )
    },
  },
  {
    accessorKey: 'created',
    header: () => h('div', { class: 'text-left' }, 'Created'),
    cell: ({ row }) =>
      h('div', { class: 'text-left font-medium' }, formatDate(row.getValue('created'))),
  },
  {
    accessorKey: 'username_author',
    header: () => h('div', { class: 'text-left' }, 'Author'),
    cell: ({ row }) =>
      h(Avatar, {
        fallbackComponent: AvatarFallback,
        imageComponent: AvatarImage,
        username: row.getValue('username_author'),
      }),
  },
]
