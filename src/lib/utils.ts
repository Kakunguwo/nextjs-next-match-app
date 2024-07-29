import { differenceInYears, format } from "date-fns";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

export function calculateAge(dob: Date) {
    return differenceInYears(new Date(), dob);
}

export function formatShortDateTime (date: Date){
    return format(date, 'dd MMM yy h:mm:a');
}




export function handleFormServerErrors<TfieldValues extends FieldValues>(errorResponse: {error: string | ZodIssue[]}, setError: UseFormSetError<TfieldValues>){
    if(Array.isArray(errorResponse.error)){
        errorResponse.error.forEach(e => {
            const fieldName = e.path.join('.') as Path<TfieldValues>;
            setError(fieldName, {message: e.message});
        })
    } else{
        setError('root.serverError', {message: errorResponse.error});
    }
}


export const truncateString = (text?: string | null, num = 50) => {
    if(!text) return null;
    if(text.length <= num){
        return text;
    }

    return text.slice(0, num) + '...';
}