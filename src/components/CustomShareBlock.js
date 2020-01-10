import PropTypes from "prop-types"
import React from "react"

import { FaTwitter, FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa"
import { ShareBlockStandard, ShareButtonIconOnly } from "react-custom-share"

import "./CustomShareBlock.css"

const CustomShareBlock = props => {
  const { url, title, siteName } = props

  const shareBlockProps = {
    url: url,
    button: ShareButtonIconOnly,
    buttons: [
      { network: "Twitter", icon: FaTwitter },
      { network: "Facebook", icon: FaFacebook },
      { network: "Linkedin", icon: FaLinkedin },
      { network: "Email", icon: FaEnvelope },
    ],
    text: title,
    longtext: siteName,
  }
  return (
    <div className="mt-4">
      <ShareBlockStandard {...shareBlockProps} />
      <p className="text-center">
        <a
          className="bmc-button"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.buymeacoffee.com/foryeffort"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
            alt="Buy me a coffee"
          />
          <span>Buy me a coffee</span>
        </a>
      </p>
    </div>
  )
}

CustomShareBlock.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  siteName: PropTypes.string,
}

CustomShareBlock.defaultProps = {
  url: "https://mywebsite.com/page-to-share/",
  title: "Default value of title",
  siteName: "Default value of excerpt",
}

export default CustomShareBlock
