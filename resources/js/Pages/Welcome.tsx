import Loading from '@/Components/Loading';
import { PageProps } from '@/types';
import {useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome() {
    const { get } = useForm();

    useEffect(() => {
        get(route('login'))
    }, []);

    return (
        <Loading />
    );
}
