export interface IUser {
    id: string;
    name: string;
    role: string;
    balance: number;
    stations?: IStation[];
}

export interface IStation {
    id: string;
    address: string;
    balance: number;
    tariffs?: ITariff[];
}

export interface ITariff {
    id: string;
    from: string;
    to: string;
    price: number;
}

export interface IOperation {
    id: string;
    type: string;
    operator: string;
    date: Date;
    data: string;
    location: string;
}