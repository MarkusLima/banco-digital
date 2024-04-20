import { useState, ChangeEvent } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Loading from '../../Components/Loading';
import { RegisterFormData } from '../../types/index';

import sendRequest from '../../Services/Axios';
import { Head, Link, useForm } from '@inertiajs/react';

import axios from 'axios';

export default function Register() {

    const { get } = useForm();

    const [formData, setFormData] = useState<RegisterFormData>({
        name: '', email: '',  password: '', date_of_birth: '', 
        cpf: '', cep: '', address: '', complemento: '', numero: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlerSubmit = async () => {
        try {
            setLoading(true);
            const response = await sendRequest({ method: 'post', body: formData, url: '/auth/register' });
            console.log('Dados recebidos:', response.data);

            if (!response.data.success) {
                alert("Houve um erro");
            } else {
                alert("Registro concluído com sucesso");
                get(route('login'))
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Houve um erro");
            console.error('Erro ao buscar dados:', error);
        }
    };

       // Função para lidar com a mudança do campo de CEP
    const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value.length === 8) {
            fetchAddressInfo(value); // Se o CEP tiver 8 caracteres, faz a busca de informações de endereço
        }
    };

    const fetchAddressInfo = async (cep: string) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const addressInfo = response.data;
            // Preencha os campos de endereço com as informações obtidas
            setFormData({
                ...formData,
                address: addressInfo.logradouro,
                complemento: addressInfo.complemento
            });
        } catch (error) {
            console.error('Erro ao buscar informações de endereço:', error);
        }
    };

    return (
        <>
            {
                loading ? 
                <Loading /> :
                <GuestLayout>
                    <Head title="Register" />
                    <form className='row'>
                        <div className='col-md-12'>
                            <InputLabel value="Name" />
                            <TextInput
                                type="text"
                                name="name"
                                className="mt-1 block w-full"
                                isFocused={true}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-12 mt-4">
                            <InputLabel value="Email" />
                            <TextInput
                                type="email"
                                name="email"
                                className="mt-1 block w-full"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-12 mt-4">
                            <InputLabel value="Password" />
                            <TextInput
                                type="password"
                                name="password"
                                className="mt-1 block w-full"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mt-4">
                            <InputLabel value="Date of birth" />
                            <TextInput
                                type="date"
                                name="date_of_birth"
                                className="mt-1 block w-full"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mt-4">
                            <InputLabel value="CPF" />
                            <TextInput
                                type="text"
                                name="cpf"
                                className="mt-1 block w-full"
                                value={formData.cpf}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-12 mt-4">
                            <InputLabel value="CEP" />
                            <TextInput
                                type="text"
                                name="cep"
                                className="mt-1 block w-full"
                                value={formData.cep}
                                onChange={handleCepChange}
                            />
                        </div>
                        <div className="col-md-12 mt-4">
                            <InputLabel value="Address" />
                            <TextInput
                                type="text"
                                name="address"
                                className="mt-1 block w-full"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-8 mt-4">
                            <InputLabel value="Complement" />
                            <TextInput
                                type="text"
                                name="complemento"
                                className="mt-1 block w-full"
                                value={formData.complemento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4 mt-4">
                            <InputLabel value="Number" />
                            <TextInput
                                type="text"
                                name="numero"
                                className="mt-1 block w-full"
                                value={formData.numero}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <Link
                                href={route('login')}
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Already registered?
                            </Link>

                            <PrimaryButton className="ms-4" onClick={handlerSubmit} type='button'>
                                Register
                            </PrimaryButton>
                        </div>
                    </form>
                </GuestLayout>      
            }
        </>
    );
}
