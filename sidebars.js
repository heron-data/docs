/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {
  mySidebar: [
    'intro',
    'quickstart',
    {
      type: 'category',
      label: 'Use Cases',
      collapsed: false,
      // link: {
      //   type: 'generated-index'
      // },
      items: [
        'use-cases/smb-lending',
        'use-cases/transaction-feed',
        'use-cases/merchant-locking'
      ]
    },
    {
      type: 'category',
      label: 'API',
      collapsed: true,
      items: [
        'authentication',
        'transactions',
        'webhooks',
        'errors'
      ]
    }
  ]
}

module.exports = sidebars
