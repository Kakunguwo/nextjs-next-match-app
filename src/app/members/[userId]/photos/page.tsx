import { getMemberPhotosByUserID } from '@/app/actions/memberActions'
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import React from 'react'

export default async function PhotosPage({params} : {params: {userId: string}}) {
  const photos = await getMemberPhotosByUserID(params.userId);
  return (
    <>
        <CardHeader className='text-2xl text-secondary font-semibold'>
            Photos
        </CardHeader>
        <Divider/>
        <CardBody>
            <div className='grid grid-cols-5 gap-3'>
              {photos && photos.map(photo => (
                <div key={photo.id}>
                  <Image
                    height={300}
                    width={300}
                    src={photo.url}
                    alt='Image of member'
                    className='object-cover aspect-auto'
                  />
                </div>
              ))}
            </div>
        </CardBody>
        </>
  )
}
