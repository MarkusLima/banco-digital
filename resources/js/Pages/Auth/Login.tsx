import { ChangeEvent, useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoginFormData } from '../../types/index';
import sendRequest from '@/Services/Axios';
import Loading from '@/Components/Loading';
import { getItemFromLocalStorage, setItemFromLocalStorage } from '@/Services/LocalStorage';

export default function Login() {
    const { get } = useForm();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',  password: ''
    });

    useEffect( () => {
        verificationAuth();
    }, []);

    async function verificationAuth(){
        try {
            const token = getItemFromLocalStorage('access_token');

            if (token) {

                const response = await sendRequest({ method: 'get', url: '/auth/verification', token:token });
    
                if (response.data.success) {
                    get(route('dashboard'));
                }

            }

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlerSubmit = async () => {
        try {
            setLoading(true);
            const response = await sendRequest({ method: 'post', body: formData, url: '/auth/login' });
            console.log('Dados recebidos:', response.data);

            if (!response.data.success) {
                alert("Houve um erro");
            } else {
                setItemFromLocalStorage("access_token", response.data.access_token)
                alert("Login concluído com sucesso");
                get(route('dashboard'))
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Houve um erro");
            console.error('Erro ao buscar dados:', error);
        }
    };

    return (
        <>
            {
                loading ? 
                <Loading /> :
                <GuestLayout>
                    <Head title="Log in" />
                    <form>
                        <div>
                            <InputLabel value="Email" />
                            <TextInput
                                type="email"
                                name="email"
                                className="mt-1 block w-full"
                                isFocused={true}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Password" />
                            <TextInput
                                type="password"
                                name="password"
                                className="mt-1 block w-full"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <Link
                                href={route('register')}
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Register
                            </Link>
                            <PrimaryButton className="ms-4" onClick={handlerSubmit} type='button'>
                                Log in
                            </PrimaryButton>
                        </div>
                        <div className="flex items-center justify-center mt-4">
                            <a href="/docs" className="text-sm text-gray-600 dark:text-gray-400">Docs</a>
                        </div>
                    </form>
                </GuestLayout>
            }
        </>
    );
}
