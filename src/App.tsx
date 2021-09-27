import React from 'react'
import './App.css'
import { Metamory } from './components/Metamory'
import { VersionSelector } from './components/VersionSelector'
import { ContentIdSelector } from './components/ContentIdSelector'
import { ContentEditor } from './components/ContentEditor'
import { PublishButton } from './components/PublishButton'
import { SaveButton } from './components/SaveButton'

function App() {
  return (
    <div className="App">
      <Metamory
        serviceBaseUrl="http://localhost:5000"
        siteName="first-site"
        contentId="frontpage"
        contentType="text/plain"
      >
        <ContentIdSelector />
        <VersionSelector />
        <PublishButton />
        <ContentEditor />
        <SaveButton />
      </Metamory>
    </div>
  )
}

export default App
