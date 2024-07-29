'use client';

import { MessageDTO } from '@/types';
import { Avatar, Button, Card, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { deleteMessage } from '../actions/messageActions';
import { truncateString } from '@/lib/utils';

type Props = {
    messages: MessageDTO[];
}

export default function MessageTable({ messages }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOutbox = searchParams.get('container') === 'outbox';

    const [isDeleting, setDeleting] = useState({id: '', loading: false});

    const columns = [
        { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
        { key: 'text', label: 'Message' },
        { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
        { key: "actions", label: "Actions"},
    ];

    const handleRowSelect = (key: React.Key) => {
        const message = messages.find(m => m.id === key);
        const url = isOutbox ? `/members/${message?.recipientId}/chat` : `/members/${message?.senderId}/chat`;
        router.push(url);
    }


    const handleDeleteMessage = useCallback( async (message: MessageDTO) => {
        setDeleting({id: message.id, loading: true});
        await deleteMessage(message.id, isOutbox);
        router.refresh();
        setDeleting({id: '', loading: false});
    }, [isOutbox,router])

    const renderCell = useCallback((item: MessageDTO, columnKey: keyof MessageDTO) => {
        const cellValue = item[columnKey]

        switch (columnKey) {
            case "recipientName":
            case "senderName":
                return (
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Avatar
                            alt='image of member'
                            src={(isOutbox? item.recipientImage : item.senderImage) || "/images/user.png"}
                        />
                        <span>{cellValue}</span>
                    </div>
                )
            case 'text':
                return (
                    <div>
                        {truncateString(cellValue, 70)}
                    </div>
                )
            case 'created':
                return cellValue
        
            default:
                return (
                    <Button 
                        isIconOnly variant='light'
                        onClick={() => handleDeleteMessage(item)}
                        isLoading={isDeleting.id == item.id && isDeleting.loading}
                    >
                        <AiFillDelete size={24} className='text-danger'/>
                    </Button>
                )
        }
    }, [isOutbox, isDeleting.loading, isDeleting.id, handleDeleteMessage])


    return (
        <Card className='flex flex-col gap-3 h-[80vh] overflow-auto'>
            <Table
                aria-label='Table with messages'
                selectionMode='single'
                onRowAction={(key) => { handleRowSelect(key) }}
                shadow='none'
            >
                <TableHeader columns={columns}>
                    {(column) => 
                    <TableColumn key={column.key} width={column.key === 'text'? '50%' : undefined}>
                        {column.label} 
                    </TableColumn>}
                </TableHeader>
                <TableBody items={messages} emptyContent="No messages for this container">
                    {(item) => (
                        <TableRow key={item.id} className='cursor-pointer'>
                            {(columnKey) => (
                                <TableCell className={`${!item.dateRead && !isOutbox ? 'font-semibold': ""}`}>
                                    {renderCell(item, columnKey as keyof MessageDTO)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
