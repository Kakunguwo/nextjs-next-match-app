'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { Member } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Key, useTransition } from 'react';
import MemberCard from '../members/MemberCard';
import LoadingComponent from '@/components/LoadingComponent';

type Props = {
    members: Member[];
    likedIds: string[];
}

export default function ListsTabs({ members, likedIds }: Props) {
    const [isPending, startTransition] = useTransition();
    const tabs = [
        { id: 'source', label: 'Members l have liked' },
        { id: 'target', label: 'Members that liked me' },
        { id: 'mutual', label: 'Mutual Likes' },
    ];

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleTabs = (key: Key) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams);
            params.set('type', key.toString());
            router.replace(`${pathname}?${params.toString()}`)
        })

    }
    return (
        <div className='flex w-full flex-col mt-10 gap-5'>
            <Tabs
                aria-label='Like tabs'
                items={tabs}
                color='secondary'
                onSelectionChange={(key) => handleTabs(key)}
            >
                {(item) => (

                    <Tab key={item.id} title={item.label}>
                        {isPending ? (
                            <div>
                                <LoadingComponent/>
                            </div>
                        ) : (
                            <>
                                {members.length > 0 ? (
                                    <div className='grid  grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
                                        {members.map(member => (
                                            <MemberCard member={member} key={member.id} likedIds={likedIds} />
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        No members found using this filter
                                    </div>
                                )}
                            </>
                        )}

                    </Tab>
                )}
            </Tabs>
        </div>
    )
}
