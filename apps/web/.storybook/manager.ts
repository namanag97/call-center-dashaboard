import { addons } from '@storybook/manager-api'

addons.setConfig({
  enableShortcuts: true,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['UI'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
}) 