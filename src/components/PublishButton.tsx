import React, { useContext } from 'react'
import { MetamoryContext } from './MetamoryFrame'

export const PublishButton = () => {
  const metamoryContext = useContext(MetamoryContext)!

  return (
    <div>
      Publish from: <input type="datetime-local" />
      <button
        disabled={metamoryContext.currentVersionId === undefined}
        onClick={event =>
          metamoryContext.publish(metamoryContext.currentVersionId!, new Date().toISOString())
        }
      >
        Publish
      </button>
    </div>
  )
}
