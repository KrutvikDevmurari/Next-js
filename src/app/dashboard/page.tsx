import React from 'react'
import Button from '../../components/UI/Button'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
const page = async ({ }) => {

    const session = getServerSession(authOptions)
    return (
        <>
            <Button variant={"ghost"}>Hello </Button>
            {JSON.stringify(session)}
        </>
    )
}

export default page
