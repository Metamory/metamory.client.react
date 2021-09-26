import React from 'react'
import './App.css'
import { MetamoryFrame } from './components/MetamoryFrame'
import { VersionSelector } from './components/VersionSelector'
import { ContentIdSelector } from './components/ContentIdSelector'
import { ContentEditor } from './components/ContentEditor'
import { PublishButton } from './components/PublishButton'

function App() {
  return (
    <div className="App">
      <MetamoryFrame
        serviceBaseUrl="http://localhost:5000"
        siteName="first-site"
        contentId="frontpage"
        contentType="text/plain"
      >
        <ContentIdSelector />
        <VersionSelector />
        <PublishButton />
        <ContentEditor />
      </MetamoryFrame>
    </div>
  )
}

export default App
