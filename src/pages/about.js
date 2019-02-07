import React from 'react'

import Layout from '../components/layout'
import siteConfig from '../../data/siteConfig'

export default () => (
  <Layout>
    <p>{siteConfig.authorDescription}</p>
  </Layout>
)
