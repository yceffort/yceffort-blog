import React from "react"
import { Link, graphql } from "gatsby"
import "bootstrap/dist/css/bootstrap.css"
import "./index.css"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Sidebar from "../components/sidebar/Sidebar"
import TechTag from "../components/tags/TechTag"

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  const labels = data.site.siteMetadata.labels
  const currentPage = 1
  const nextPage = (currentPage + 1).toString()

  const getTechTags = tags => {
    const techTags = []
    tags.forEach((tag, i) => {
      labels.forEach(label => {
        if (tag === label.tag) {
          techTags.push(
            <TechTag
              key={i}
              tag={label.tag}
              tech={label.tech}
              name={label.name}
              size={label.size}
              color={label.color}
            />
          )
        }
      })
    })
    return techTags
  }

  return (
    <Layout>
      <SEO
        title="yceffort's blog"
        keywords={[
          `javascript`,
          `react`,
          `web development`,
          `programming`,
          `blog`,
        ]}
        image="/utils/share.png"
      />
      <div className="index-main">
        <div className="sidebar px-4 py-2">
          <Sidebar />
        </div>
        <div className="post-list-main">
          {posts.map(post => {
            const tags = post.node.frontmatter.tags
            return (
              <div key={post.node.id} className="container mt-5 y_index">
                <Link to={post.node.fields.slug} className="text-dark">
                  <h2 className="title" style={{ marginBottom: "10px" }}>
                    {post.node.frontmatter.title}
                  </h2>
                </Link>
                <small className="d-block text-info">
                  <i>Posted on {post.node.frontmatter.date}</i>
                </small>
                <p className="mt-3 d-inline">{post.node.excerpt}</p>
                <Link to={post.node.fields.slug} className="text-primary">
                  <small className="d-inline-block ml-3"> Read full post</small>
                </Link>
                <div className="d-block">{getTechTags(tags)}</div>
              </div>
            )
          })}
          <div className="mt-4 text-center">
            <Link to={nextPage} rel="next" style={{ textDecoration: `none` }}>
              <span className="text-dark">Next Page →</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        author
        labels {
          tag
          tech
          name
          size
          color
        }
      }
    }
    allMarkdownRemark(
      limit: 10
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { published: { eq: true } } }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 500)
          html
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default IndexPage
