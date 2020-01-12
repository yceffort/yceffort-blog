import React from "react"
import { FaLinkedin, FaGithubSquare } from "react-icons/fa"

import "./SocialLinks.css"
import FloatingSearch from "../search/floating-search"

const SocialLinks = ({ contacts }) => {
  return (
    <div className="social-links float-right mr-4">
      <a className="text-primary ml-4" href={contacts.linkedin}>
        <span title="Linked In">
          <FaLinkedin size={30} style={{ color: "primary" }} />
        </span>
      </a>
      <a className="text-light ml-4" href={contacts.github}>
        <span title="GitHub">
          <FaGithubSquare size={30} style={{ color: "light" }} />
        </span>
      </a>
      <FloatingSearch />
    </div>
  )
}

export default SocialLinks
