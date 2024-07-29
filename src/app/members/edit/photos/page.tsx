import { getAuthId } from '@/app/actions/authActions'
import { getMemberPhotosByUserID } from '@/app/actions/memberActions';
import DeleteButton from '@/components/DeleteButton';
import StarButton from '@/components/StarButton';
import { CardHeader, Divider, CardBody, Image } from '@nextui-org/react'
import React from 'react'


export default async function PhotosPage() {
    const userId = await getAuthId();

    const photos = await getMemberPhotosByUserID(userId);
    return (
        <>
            <CardHeader className='text-2xl text-secondary font-semibold'>
                Edit Profile
            </CardHeader>
            <Divider />
            <CardBody>
                <div className='grid grid-cols-5 gap-3 p-5'>
                    {photos && photos.map(photo => (
                        <div key={photo.id} className='relative'>
                            <Image
                                width={220}
                                height={220}
                                src={photo.url}
                                alt='User Image'
                            />
                            <div className='absolute top-3 left-3 z-50'>
                                <StarButton selected={true} loading={false}/>
                            
                            </div>
                            <div className='absolute top-3 right-3 z-50'>
                                <DeleteButton loading={false}/>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </>
    )
}
