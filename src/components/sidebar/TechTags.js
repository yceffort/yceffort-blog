import React from "react"

import TechTag from "../tags/TechTag"

const TechTags = props => {
  const labels = props.labels
  const posts = props.posts

  const labelCount = labels.map(label => {
    let count = 0
    posts.forEach(post => {
      if (post.node.frontmatter.tags.includes(label.tag)) {
        count = count + 1
      }
    })
    return [label.tag, count]
  })

  const categories = labelCount.filter(label => {
    return label[1] > 0
  })

  const tags = categories.map(category => {
    return category[0]
  })

  const getTechTags = () => {
    const techTags = []

    labels
      .sort((a, b) => (a.tech > b.tech ? 1 : -1))
      .forEach((label, i) => {
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
      })
    return techTags
  }

  return (
    <>
      <h4>Tech Topics</h4>
      <div className="d-block">{getTechTags(tags)}</div>
    </>
  )
}

export default TechTags
