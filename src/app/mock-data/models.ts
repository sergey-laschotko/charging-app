export interface IUser {
    name: string;
    role: string;
    balance: number;
    stations?: IStation[];
}

export interface IStation {
    address: string;
    balance: number;
    tariffs?: ITariff[];
}

export interface ITariff {
    from: string;
    to: string;
    price: number;
}

export interface IOperation {
    type: string;
    operator: string;
    date: string;
}