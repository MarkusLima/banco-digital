import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getItemFromLocalStorage } from '@/Services/LocalStorage';
import sendRequest from '@/Services/Axios';
import { ItemAccount } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';


export default function Dashboard() {
    const [userData, setUserData] = useState({
        id: "", name: "", email: "",
        date_of_birth: "", cpf: "", cep: "",
        address: "", complemento: "", numero: "",
        created_at: ""
    });

    const [accounts, setAccounts] = useState<ItemAccount[]>([]);

    const { get } = useForm();

    useEffect( () => {
        fetchData();
    }, []);

    async function fetchData(){
        try {
            const token = getItemFromLocalStorage('access_token');

            if (token) {

                const response = await sendRequest({ method: 'get', url: '/user/me', token:token });
                console.log(response.data)
    
                if (response.data.success) {
                    setUserData({
                        id: response.data.data[0].id, 
                        name: response.data.data[0].name, 
                        email: response.data.data[0].email,
                        date_of_birth: response.data.data[0].date_of_birth, 
                        cpf: response.data.data[0].cpf, 
                        cep: response.data.data[0].cep,
                        address: response.data.data[0].address, 
                        complemento: response.data.data[0].complemento, 
                        numero: response.data.data[0].numero,
                        created_at: response.data.data[0].created_at
                    });

                    setAccounts(response.data.data[0].account);
                }

            }

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    const handlerNewAccount = async () => {
        try {
            const token = getItemFromLocalStorage('access_token');

            if (token) { 

                const response = await sendRequest({ method: 'post', url: '/account/store', token:token });
                console.log('Dados recebidos:', response.data);
    
                if (!response.data.success) {
                    alert("Occured error");
                } else {
                    alert("Accounts created success");
                    get(route('dashboard'))
                }

            }

        } catch (error) {
            alert("Occured error");
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handlerDelete = async (id: string) => {
        try {
            const token = getItemFromLocalStorage('access_token');

            if (token) { 

                const response = await sendRequest({ method: 'delete', url: '/account/destroy/'+id, token:token });
                console.log('Dados recebidos:', response.data);
    
                if (!response.data.success) {
                    alert("Occured error");
                } else {
                    alert("Accounts deleted success");
                    get(route('dashboard'))
                }

            }

        } catch (error) {
            alert("Occured error");
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handlerDetailsAccount = async (id: string) => {
        get(route('balance', id))
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="container">
                <div className="card mt-1">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-12 d-flex justify-content-end">
                                <PrimaryButton className="ms-4" onClick={handlerNewAccount} type='button'>
                                    New Account
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row bg-white">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className='text-primary mt-1 mb-1'>USER</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p>ID : <b>{userData.id}</b></p>
                                                <p>NAME : <b>{userData.name}</b></p>
                                                <p>EMAIL : <b>{userData.email}</b></p>
                                                <p>DATE OF BIRTH : <b>{userData.date_of_birth}</b></p>
                                                <p>CPF : <b>{userData.cpf}</b></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p>CEP : <b>{userData.cep}</b></p>
                                                <p>ADDRESS : <b>{userData.address}</b></p>
                                                <p>COMPLEMENT : <b>{userData.complemento}</b></p>
                                                <p>NUMBER : <b>{userData.numero}</b></p>
                                                <p>CREATED : <b>{userData.created_at}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className='text-primary mt-1 mb-1'>ACCOUNTS</div>
                                    </div>
                                    <div className="card-body">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Balance</th>
                                                <th scope="col">Created</th>
                                                <th scope="col">Updated</th>
                                                <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {accounts.map((account) => (
                                                    <tr key={account.id}>
                                                        <th>{account.id}</th>
                                                        <td>{"R$ "+account.balance}</td>
                                                        <td>{account.created_at}</td>
                                                        <td>{account.updated_at}</td>
                                                        <td>
                                                            <PrimaryButton className="ms-4" onClick={async() => { await handlerDetailsAccount(account.id) }} type='button'>
                                                                Details
                                                            </PrimaryButton>
                                                            <PrimaryButton className="ms-4" onClick={async() => { await handlerDelete(account.id) }} type='button'>
                                                                Delete
                                                            </PrimaryButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
