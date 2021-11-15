// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Heron Data Documentation',
  tagline: 'Transaction Enrichment and Categorization API',
  url: 'https://docs.herondata.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon.png',
  organizationName: 'heron-data', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  presets: [
    [
      'redocusaurus',
      {
        specs: [{
          routePath: '/api',
          specUrl: 'https://app.herondata.io/swagger/',
          layout: {
            title: 'API Reference'
          }
        }]
      }
    ],
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/heron-data/docs',
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Heron Data',
        logo: {
          alt: 'Heron Data Logo',
          src: 'img/icon.png'
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial'
          },
          { to: '/api', label: 'API Reference', position: 'left' },
          {
            href: 'https://github.com/heron-data/docs',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/'
              },
              {
                label: 'API Reference',
                to: '/api'
              }
            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus'
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus'
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://www.herondata.io/blog'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/heron-data'
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/herondata'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Open Credit Technologies`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config
