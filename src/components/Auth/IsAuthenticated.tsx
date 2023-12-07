import React from "react"
import { useAuth0 } from "@auth0/auth0-react"


type IsAuthenticatedProps = {
    yes?: React.ReactNode
    no?: React.ReactNode
}

const IsAuthenticated = ({ yes, no }: IsAuthenticatedProps) => {
    const { isAuthenticated } = useAuth0()

    return <>
        {
            isAuthenticated
                ? yes
                : no
        }
    </>
}

export default IsAuthenticated