import { getMemberByUserID } from '@/app/actions/memberActions'
import React, { ReactNode } from 'react'
import MemberSidebar from '../MemberSidebar';
import { notFound } from 'next/navigation';
import { Card } from '@nextui-org/react';

export default async function Layout({ children, params }: { children: ReactNode, params: { userId: string } }) {
    const member = await getMemberByUserID(params.userId);
    if(!member) return notFound();

    const baseURL = `/members/${member.userId}`;

    const navLinks = [
        {name: 'Profile', href: `${baseURL}`},
        {name: 'Photos', href: `${baseURL}/photos`},
        {name: 'Chat', href: `${baseURL}/chat`},
    ]
    return (
        <div className='grid grid-cols-12 gap-5 h-[80vh]'>
            <div className='col-span-3'>
                <MemberSidebar member={member} navLinks={navLinks}/>
            </div>
            <div className='col-span-9'>
                <Card className='w-full mt-10 h-[80vh]'>
                    {children}
                </Card>
            </div>
        </div>
    )
}
