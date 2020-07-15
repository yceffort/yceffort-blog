import React from "react"
import { graphql } from "gatsby"
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button" //Add this line Here

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./blog-post.css"

import Sidebar from "../components/sidebar/Sidebar"
import TechTag from "../components/tags/TechTag"
import CustomShareBlock from "../components/CustomShareBlock"
import Utterances from "../components/Utterances"
import 'gatsby-remark-mathjax-ssr/mathjax.css'

const BlogPost = props => {
  const post = props.data.markdownRemark
  const labels = props.data.site.siteMetadata.labels
  const siteName = props.data.site.siteMetadata.title
  const siteUrl = props.data.site.siteMetadata.url
  const url = `${siteUrl}${props.pageContext.slug}`
  const tags = post.frontmatter.tags

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
      <SEO title={post.frontmatter.title} />
      <div className="post-page-main">
        <div className="sidebar px-4 py-2">
          <Sidebar />
        </div>

        <div className="post-main">
          <SEO title={post.frontmatter.title} />
          <div className="mt-3">
            <h2 className="heading">{post.frontmatter.title}</h2>
            <div className="d-block">{getTechTags(tags)}</div>
            <small>
              <i>Published on </i> {post.frontmatter.date}
            </small>
            <div
              dangerouslySetInnerHTML={{ __html: post.html }}
              style={{ marginTop: "2rem" }}
            />
            <CustomShareBlock
              title={post.frontmatter.title}
              siteName={siteName}
              url={url}
            />
          </div>
          <Utterances repo="yceffort/yceffort-blog-comments" />
        </div>
      </div>

      <ScrollUpButton
        StopPosition={0}
        ShowAtPosition={150}
        EasingType="easeOutCubic"
        AnimationDuration={500}
        ContainerClassName="ScrollUpButton__Container"
        TransitionClassName="ScrollUpButton__Toggled"
        style={{}}
        ToggledStyle={{}}
      />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        url
        title
        labels {
          tag
          tech
          name
          size
          color
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
        mathjax
      }
    }
  }
`

export default BlogPost
