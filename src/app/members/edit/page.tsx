import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import React from 'react'
import EditForm from './EditForm'
import { getAuthId } from '@/app/actions/authActions'
import { getMemberByUserID } from '@/app/actions/memberActions';
import { notFound } from 'next/navigation';

export default async function MemberEditPage() {
    const userId = await getAuthId();
    const member = await getMemberByUserID(userId);

    if(!member) return notFound();
    return (
        <>
            <CardHeader className='text-2xl text-secondary font-semibold'>
                Edit Profile
            </CardHeader>
            <Divider />
            <CardBody>
                <EditForm member={member}/>
            </CardBody>
        </>
    )
}
