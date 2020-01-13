import React from "react"
import { connectSearchBox } from "react-instantsearch-dom"

import { Input } from "./styles"

export default connectSearchBox(({ refine, ...rest }) => (
  <Input
    type="text"
    placeholder="keyword"
    aria-label="keyword"
    onChange={e => refine(e.target.value)}
    {...rest}
  />
))
