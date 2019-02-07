import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import siteConfig from '../../data/siteConfig'

import Sidebar from './sidebar'

const Container = styled.div`
  display: flex;
  height: 100vh;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
  padding: 20px;
  color: #7e7e7e;
`

const Query = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`

export default ({ children }) => (
  <StaticQuery
    query={Query}
    render={data => {
      const { title, siteDescription, authorName } = data.site.siteMetadata
      return (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <meta name="description" content={siteDescription} />
            <title>{siteConfig.siteTitle}</title>
          </Helmet>
          <Container>
            <Sidebar title={siteConfig.siteTitle} authorName={siteConfig.authorName} />
            <Content>{children}</Content>
          </Container>
        </>
      )
    }}
  />
)
