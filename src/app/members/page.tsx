import Link from 'next/link'
import React from 'react'

export default function MembersPage() {
  return (
    <div>
      <h3 className='text-3xl'>This is the members Page</h3>
      <Link href={'/'}>Go to Homepage</Link>
    </div>
  )
}
