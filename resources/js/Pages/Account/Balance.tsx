import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getItemFromLocalStorage } from '@/Services/LocalStorage';
import sendRequest from '@/Services/Axios';
import { ItemMovAccount, SelectOptions } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import Accordion from 'react-bootstrap/Accordion';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { Form } from 'react-bootstrap';


export default function Balance({ account_id }: { account_id: string }) {
    const [account, setAccount] = useState(account_id);
    const [typeTransaction, setTypeTransaction] = useState("");
    const [accountIdTransfer, setAccountIdTransfer] = useState("");
    const [accountsIdTransfer, setAccountsIdTransfer] = useState<SelectOptions[]>([]);
    const [accountId, setAccountId] = useState("");
    const [accountsId, setAccountsId] = useState<SelectOptions[]>([]);
    const [value, setValue] = useState("");
    const [trasnfer, setTransfer] = useState(false);

    const [transctionsDep, setTransectionsDep] = useState<ItemMovAccount[]>([]);
    const [transctionsOut, setTransectionsOut] = useState<ItemMovAccount[]>([]);
    const [transctionsTransfIn, setTransectionsTransfIn] = useState<ItemMovAccount[]>([]);
    const [transctionsTransfOut, setTransectionsTransfOut] = useState<ItemMovAccount[]>([]);

    const [showModal, setShowModal] = useState(false);

    const { get } = useForm();

    useEffect( () => {
        fetchData();
    }, []);

    async function fetchData(){
        try {
            const token = getItemFromLocalStorage('access_token');

            if (token) {

                const response = await sendRequest({ method: 'get', url: '/account/balance/'+account, token:token });
                console.log(response.data)
    
                if (response.data.success) {

                    setTransectionsDep(response.data.data.dep);

                    setTransectionsOut(response.data.data.outs);

                    setTransectionsTransfIn(response.data.data.transf_in);

                    setTransectionsTransfOut(response.data.data.transf_out);
                }

            }

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    async function fetchDataAccounts(find = ""){
        try {
            const token = getItemFromLocalStorage('access_token');

            if (token) {

                const response = await sendRequest({ method: 'get', url: '/account/all/'+find, token:token });
                return response.data.data;

            }

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    const handlerNewAccount = async () => {
        setShowModal(true);
    };

    const CreateNewTransaction = async () => {
        try {

            const body = {
                value:value,
                account_id: accountId,
                account_id_transfer: accountIdTransfer,
            }

            const token = getItemFromLocalStorage('access_token');

            if (token) { 

                const response = await sendRequest({ method: 'post', body:body, url: '/account/'+typeTransaction, token:token });
                console.log('Dados recebidos:', response.data);
    
                if (!response.data.success) {
                    alert("Occured error");
                    alert(response.data.error);
                } else {
                    alert("Accounts created success");
                    get(route('balance', account))
                }

            }

        } catch (error) {
            alert(error);
            console.error('Erro ao buscar dados:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const setTypeTransactionFrom = async (type:string) => {
        console.log(type)
        if (type == "deposit") {

            var response = await fetchDataAccounts();
            console.log(response);
            setAccountsId(response);
            setTransfer(false);

        }

        if (type == "transfer") {

            var response = await fetchDataAccounts("true");
            console.log(response);
            setAccountsId(response);
            var response_ = await fetchDataAccounts();
            console.log(response_);
            setAccountsIdTransfer(response_)
            setTransfer(true);
            
        }

        if (type == "cashout") {

            var response = await fetchDataAccounts("true");
            console.log(response);
            setAccountsId(response);
            setTransfer(false);
            
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Balance #Account {account}</h2>}
        >
            <Head title="Balance" />

            <div className="container">
                <div className="row bg-white mt-5">
                    <div className="col-md-12">
                            <Link
                                href={route('dashboard')}
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Back
                            </Link>
                        <PrimaryButton className="ms-4 mt-3 mb-3" onClick={handlerNewAccount} type='button'>
                            New Transaction
                        </PrimaryButton>
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">TRANSACTIONS</div>
                            <div className="card-body">
                                <Accordion defaultActiveKey={['0']} alwaysOpen>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Deposits</Accordion.Header>
                                        <Accordion.Body>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Cod</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Created</th>
                                                    <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transctionsDep.map((transctionDep) => (
                                                        <tr key={transctionDep.id}>
                                                            <th>{transctionDep.id}</th>
                                                            <td>{transctionDep.cod}</td>
                                                            <td>{"R$"+transctionDep.value}</td>
                                                            <td>{transctionDep.created_at}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Cachout</Accordion.Header>
                                        <Accordion.Body>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Cod</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Created</th>
                                                    <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transctionsOut.map((transctionDep) => (
                                                        <tr key={transctionDep.id}>
                                                            <th>{transctionDep.id}</th>
                                                            <td>{transctionDep.cod}</td>
                                                            <td>{"R$"+transctionDep.value}</td>
                                                            <td>{transctionDep.created_at}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Tranfers In</Accordion.Header>
                                        <Accordion.Body>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Cod</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Created</th>
                                                    <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transctionsTransfIn.map((transctionDep) => (
                                                        <tr key={transctionDep.id}>
                                                            <th>{transctionDep.id}</th>
                                                            <td>{transctionDep.cod}</td>
                                                            <td>{"R$"+transctionDep.value}</td>
                                                            <td>{transctionDep.created_at}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>Transfer Out</Accordion.Header>
                                        <Accordion.Body>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Cod</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Created</th>
                                                    <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transctionsTransfOut.map((transctionDep) => (
                                                        <tr key={transctionDep.id}>
                                                            <th>{transctionDep.id}</th>
                                                            <td>{transctionDep.cod}</td>
                                                            <td>{"R$"+transctionDep.value}</td>
                                                            <td>{transctionDep.created_at}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>

                                <Modal show={showModal} onClose={closeModal}>
                                    <form  className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Add new transaction
                                        </h2>
                                        <div className="mt-6">
                                            <InputLabel value="Type transaction" className="sr-only" />
                                            <Form.Select
                                                value={typeTransaction}
                                                onChange={(e) => {
                                                    setTypeTransaction(e.target.value);
                                                    setTypeTransactionFrom(e.target.value)
                                                }}
                                            >
                                                <option value="">--select--</option>
                                                <option value="deposit">Deposit</option>
                                                <option value="transfer">Transfer</option>
                                                <option value="cashout">Cashout</option>
                                            </Form.Select>
                                        </div>
                                        <div className="mt-6">
                                            <InputLabel value="Account" className="sr-only" />
                                            <Form.Select
                                                value={accountId}
                                                onChange={(e) => setAccountId(e.target.value)}
                                            >
                                                <option value="">--select--</option>
                                                { accountsId.map((options)=>(
                                                        <option key={options.id} value={options.id}>{options.options}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        { trasnfer ?
                                            <div className="mt-6">
                                                <InputLabel value="Account Transfer" className="sr-only" />
                                                <Form.Select
                                                    value={accountIdTransfer}
                                                    onChange={(e) => setAccountIdTransfer(e.target.value)}
                                                >
                                                    <option value="">--select--</option>
                                                    { accountsIdTransfer.map((options)=>(
                                                        <option key={options.id} value={options.id}>{options.options}</option>
                                                    ))}
                                                </Form.Select>
                                            </div> : null
                                         }
                                        <div className="mt-6">
                                            <InputLabel value="Value" className="sr-only" />
                                            <TextInput
                                                type="number"
                                                className="mt-1 block"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                                            <PrimaryButton className="ms-4" onClick={async() => { await CreateNewTransaction() }} type='button'>
                                                Save
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
