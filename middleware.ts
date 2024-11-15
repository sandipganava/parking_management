import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
    '/mybookings(.*)',
    '/book/(.*)'
])

const isAdminRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware((auth, req: NextRequest) => {

    const { userId, redirectToSignIn, sessionClaims } = auth()

    if (!userId && (isProtectedRoute(req) || isAdminRoute(req))) {
        return redirectToSignIn({ returnBackUrl: req.url })
    }

    if (userId && isAdminRoute(req)) {
        return NextResponse.next()
        console.log(sessionClaims?.metadata.role)
        if (sessionClaims?.metadata.role === 'admin') {
        } else {
            return new Response(`You are not authorized`, {status: 401})
        }
    }

    return NextResponse.next()
})