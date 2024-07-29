import React, { ReactNode } from 'react'
import MemberSidebar from '../MemberSidebar';
import { notFound } from 'next/navigation';
import { Card } from '@nextui-org/react';
import { getAuthId, getUserById } from '@/app/actions/authActions';
import { getMemberByUserID } from '@/app/actions/memberActions';

export default async function Layout({ children}: { children: ReactNode }) {
    const userId = await getAuthId();
    const member = await getMemberByUserID(userId);
    if(!member) return notFound();

    const baseURL = `/members/edit`;

    const navLinks = [
        {name: 'Edit Profile', href: `${baseURL}`},
        {name: 'Upload Photos', href: `${baseURL}/photos`},
       
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
