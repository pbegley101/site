import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Skills from '../components/skills'

import siteConfig from '../../data/siteConfig'

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
    <Skills title='Skills' skills={siteConfig.skills} />
  </Layout>
)

export default SecondPage
