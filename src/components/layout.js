/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import "bootstrap/dist/css/bootstrap.css"
import Header from "./header/header"
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
              tagline
              author
              contacts {
                github
                linkedin
              }
            }
          }
        }
      `}
      render={data => (
        <>
          <Header
            siteTitle={data.site.siteMetadata.title}
            tagline={data.site.siteMetadata.tagline}
            author={data.site.siteMetadata.author}
            contacts={data.site.siteMetadata.contacts}
          />
          <div
            style={{
              margin: `0 auto`,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
              wordBreak: "break-all",
            }}
          >
            <main
              className="p-4"
              ref={node => {
                if (node) {
                  node.style.setProperty("padding", "0rem", "important")
                }
              }}
            >
              {children}
            </main>
            <footer className="text-center" style={{ marginTop: "1rem" }}>
              <hr />
              <p className="d-inline">
                © {new Date().getFullYear()}{" "}
                <a className="text-info" href="https://yceffort.kr/">
                  yceffort
                </a>
                , All Rights Reserved.
              </p>
            </footer>
          </div>
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
