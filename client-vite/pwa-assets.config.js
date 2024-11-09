import {
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset,
  maskable: {
    sizes: [512],
    padding: 0.35
  },

  images: ['public/vite.svg']
})
