// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Heron Data Documentation",
  tagline: "Transaction Enrichment and Categorization API",
  url: "https://docs.herondata.io",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/icon.png",
  organizationName: "heron-data",
  projectName: "docs",
  presets: [
    [
      "redocusaurus",
      {
        specs: [
          {
            routePath: "/api",
            specUrl: process.env.SPEC_URL,
            layout: {
              title: "API Reference",
            },
          },
        ],
      },
    ],
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/heron-data/docs/tree/main",
          routeBasePath: "/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Heron Data",
        logo: {
          alt: "Heron Data Logo",
          src: "img/icon.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Tutorial",
          },
          {
            to: "/api",
            label: "API Reference",
            position: "left",
          },
          {
            to: "https://status.herondata.io",
            label: "Status",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/",
              },
              {
                label: "API Reference",
                to: "/api",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Blog",
                to: "https://www.herondata.io/blog",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/herondata",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Website",
                href: "https://www.herondata.io",
              },
              {
                label: "GitHub",
                href: "https://github.com/heron-data",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Open Credit Technologies`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
