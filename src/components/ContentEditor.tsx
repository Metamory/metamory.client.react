import React, { useContext } from 'react'
import { MetamoryContext } from './MetamoryFrame'

export const ContentEditor = () => {
  const metamoryContext = useContext(MetamoryContext)!
  return (
    <div>
      Content type: {metamoryContext.contentType}
      <br />
      Content
      <br />
      <textarea value={metamoryContext.content}></textarea>
    </div>
  )
}
