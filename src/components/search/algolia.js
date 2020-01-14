const postQuery = `{
  posts: allMarkdownRemark(filter: {}) {
    edges {
      node {
        objectID: id
        timeToRead
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          tags
        }
        excerpt(pruneLength: 3000)
        fields {
          slug
        }
      }
    }
  }
}
`

const flatten = arr =>
  arr.map(({ node: { frontmatter, fields: { slug }, ...rest } }) => ({
    ...frontmatter,
    slug,
    ...rest,
  }))
const settings = { attributesToSnippet: [`excerpt:100`] }

const queries = [
  {
    query: postQuery,
    transformer: ({ data }) => flatten(data.posts.edges),
    indexName: `yceffort-blog-post`,
    settings,
  },
]

module.exports = queries
