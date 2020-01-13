import React, { Fragment } from "react"
import { Highlight, Snippet } from "react-instantsearch-dom"
import { Link } from "gatsby"

import labels from "../../../labels.json"
import TechTag from "../tags/TechTag.js"

export const PageHit = clickHandler => ({ hit }) => (
  <div>
    <Link to={hit.slug} onClick={clickHandler}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)

const getTag = tech => {
  const label = labels.find(l => l.tag === tech)
  return label ? label : undefined
}

export const PostHit = clickHandler => ({ hit }) => {
  const endLink = hit.permalink ? new URL(hit.permalink).pathname : hit.slu

  return (
    <div>
      <Link to={endLink} onClick={clickHandler}>
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
      </Link>
      <div>
        {hit.tags.map((tag, index) => (
          <Fragment key={tag}>
            {getTag(tag) ? <TechTag {...getTag(tag)} /> : tag}
          </Fragment>
        ))}
      </div>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </div>
  )
}
