'use client';

import { calculateAge } from '@/lib/utils';
import { Button, Card, CardBody, CardFooter, Divider, Image } from '@nextui-org/react';
import { Member } from '@prisma/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
    member: Member
}

export default function MemberSidebar({ member }: Props) {
    const baseURL = `/members/${member.userId}`;
    const pathname = usePathname();
    const navLinks = [
        {name: 'Profile', href: `${baseURL}`},
        {name: 'Photos', href: `${baseURL}/photos`},
        {name: 'Chat', href: `${baseURL}/chat`},
    ]
    return (
        <Card className='w-full mt-10 items-center h-[80vh]'> 
            <Image 
                height={100}
                width={100}
                src={member.image || '/images/user.png'}
                alt={member.name}
                className='rounded-full mt-6 aspect-square object-cover'
            />
            <CardBody >
                <div className='flex flex-col items-center'>
                    <div className='text-xl '>
                        {member.name}, {calculateAge(member.dateOfBirth)}
                    </div>
                    <div className='text-sm text-neutral-500 '>
                        {member.city}, {member.country}
                    </div>
                </div>
                <Divider className='my-3'/>
                <nav className='flex flex-col p-4 ml-4 text-2xl gap-4'>
                    {navLinks.map(link => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={`block rounded ${pathname === link.href ? 'text-secondary' : 'hover: text-secondary/50'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </CardBody>
            <CardFooter>
                <Button
                    as={Link}
                    href='/members'
                    fullWidth
                    color='secondary'
                    variant='bordered'
                >
                    Go back
                </Button>
            </CardFooter>
        </Card>
    )
}
