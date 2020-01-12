import React from "react"

import Search from "./index"
import "./styles.css"
import { FaSearch } from "react-icons/fa"

export default function FloatingSearch() {
  return (
    <div className="ml-4">
      <a href="#search">
        <FaSearch size={25} style={{ color: "white" }} />
      </a>

      <div id="search" className="overlay">
        <div className="popup">
          <a class="close" href="#">
            &times;
          </a>
          <Search
            collapse
            indices={[
              {
                name: `yceffort_blog`,
                title: `Blog Posts`,
                hitComp: `PostHit`,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
