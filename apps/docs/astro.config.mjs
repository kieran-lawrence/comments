// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
    image: {
        service: passthroughImageService(),
    },
    integrations: [
        starlight({
            title: 'Comments Docs',
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/withastro/starlight',
                },
            ],
            sidebar: [
                {
                    label: 'Apps',
                    items: [
                        // Each item here is one entry in the navigation menu.
                        { label: 'API', slug: 'apps/api' },
                        { label: 'Dashboard', slug: 'apps/web' },
                        {
                            label: 'Infrastructure',
                            slug: 'apps/infrastructure',
                        },
                    ],
                },
                {
                    label: 'Packages',
                    items: [
                        { label: 'Component Library', slug: 'packages/ui' },
                        {
                            label: 'ESLint Config',
                            slug: 'packages/eslint-config',
                        },
                        {
                            label: 'Shared Types',
                            slug: 'packages/shared-types',
                        },
                        {
                            label: 'Tailwind Config',
                            slug: 'packages/tailwind-config',
                        },
                        {
                            label: 'TypeScript Config',
                            slug: 'packages/typescript-config',
                        },
                    ],
                },
            ],
        }),
    ],
})
