export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};


export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    date_of_birth: string;
    cpf: string;
    cep: string;
    address: string;
    complemento: string;
    numero: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface ItemAccount {
    id: string, 
    user_id: string,
    balance: string, 
    created_at: string, 
    updated_at: string, 
}

export interface ItemMovAccount {
    id: string, 
    cod: string,
    value: string, 
    created_at: string, 
}

export interface SelectOptions {
    id: string, 
    options: string,
}

