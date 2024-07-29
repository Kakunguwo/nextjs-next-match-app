import { getMemberByUserID } from '@/app/actions/memberActions'
import CardWithWrapper from '@/components/CardWithWrapper';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function MemberDetailedPage({ params }: { params: { userId: string } }) {
    const member = await getMemberByUserID(params.userId);

    if(!member) return notFound();
    return (
        <CardWithWrapper 
            header="Profile"
            body={<div>{member.description}</div>}
        />
    )
}
