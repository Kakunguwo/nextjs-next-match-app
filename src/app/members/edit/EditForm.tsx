'use client';

import { updateMember } from '@/app/actions/userActions';
import { EditFormSchema, editFormSchema } from '@/lib/Schemas/editFormSchema';
import { handleFormServerErrors } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@nextui-org/react';
import { Member } from '@prisma/client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


type Props = {
    member: Member
}

export default function EditForm({ member }: Props) {

    const { register, handleSubmit, reset,setError,formState: { errors, isDirty, isValid, isSubmitting } } = useForm<EditFormSchema>({
        resolver: zodResolver(editFormSchema),
        mode: "onTouched",
    });
    const router = useRouter();

    const onSubmit = async (data: EditFormSchema) => {
        console.log(data);

        const result = await updateMember(data);

        if (result.status === 'success') {
            toast.success("Profile updated");
            router.refresh();
            reset({...data});
        } else {
            handleFormServerErrors(result, setError);
            toast.error(result.error as string);
        }

    }

    useEffect(() => {
        if (member) {
            reset({
                name: member.name,
                city: member.city,
                country: member.country,
                description: member.description,
            })
        }
    }, [member, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
            <Input
                label='Name'
                variant='bordered'
                {...register('name')}
                defaultValue={member.name}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
            />
            <Textarea
                label='Description'
                variant='bordered'
                {...register('description')}
                defaultValue={member.description}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                minRows={6}
            />
            <div className='flex flex-row gap-3'>
                <Input
                    label='City'
                    variant='bordered'
                    {...register('city')}
                    defaultValue={member.city}
                    isInvalid={!!errors.city}
                    errorMessage={errors.city?.message}
                />

                <Input
                    label='Country'
                    variant='bordered'
                    {...register('country')}
                    defaultValue={member.country}
                    isInvalid={!!errors.country}
                    errorMessage={errors.country?.message}
                />
            </div>
            {errors.root?.serverError && (
                <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
            )}
            <Button
                type='submit'
                variant='solid'
                color='secondary'
                isDisabled={!isDirty || !isValid}
                isLoading={isSubmitting}
                className='flex self-end'
            >
                Update profile
            </Button>

        </form>
    )
}
