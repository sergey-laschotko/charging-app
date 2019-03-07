import { IUser, IOperation } from "./models";

export const stations = [
    "Герасименко, 2",
    "Машиностроителей, 7Б",
    "Промышленная, 2Б ",
    "Шаранговича, 81",
    "Партизанский, 8а",
    "Тростенецкая, 16",
    "Казинца, 133",
    "Аннаева, 47",
    "Ваупшасова, 40",
    "Радиальная, 13а",
    "Академическая, 34",
    "Некрасова, 41",
    "Притыцкого, 62в",
    "Харьковская, 81",
    "Масюковщина, 2а, корп.3",
    "Брикета, 23",
    "Казимировская, 39",
    "Пригородная, 69",
    "Долгиновский тракт, 190",
    "Долгиновский тракт, 178/1",
    "Логойский тракт, 49",
];

export const stationsOwners = [
    "Александр Иванов",
    "Петр Сергеев",
    "Дмитрий Силиванов",
    "Алексей Невзоров",
    "Игорь Малышев"
];

export const users = [
    "Андрей Петров",
    "Надежда Макеева",
    "Сергей Шаповалов",
    "Ольга Смирнова",
    "Кирилл Новожилов"
];

export const operations = ["Зарядка", "Бронь", "Продажа токенов", "Покупка токeнов"];

export class DataSource {
    static instance: DataSource = null;
    stations: string[];
    operations: string[];
    stationsOwners: string[];
    users: string[];

    constructor(stations: string[], operations: string[], stationsOwners: string[], users: string[]) {
        if (!DataSource.instance) {
            this.stations = stations;
            this.operations = operations;
            this.stationsOwners = stationsOwners;
            this.users = users;
            DataSource.instance = this;
        } else {
            return DataSource.instance;
        }
    }
    
    getRandom = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    generate() {
        let dataSource: { users: IUser[], operations: IOperation[] } = {
            users: [],
            operations: []
        };
        dataSource.users = [];
        dataSource.operations = [];
        let stations = this.stations;
        let operators: string[] = [...this.stationsOwners, ...this.users];
        
        // add users
        this.users.forEach((user: string) => {
            dataSource.users.push({ 
                name: user, 
                role: 'user',
                balance: this.getRandom(5, 100)
            });
        });

        // add owners
        this.stationsOwners.forEach((owner: string) => {
            dataSource.users.push({ 
                name: owner, 
                role: 'owner',
                balance: this.getRandom(5, 100),
                stations: [],
            });
        });

        // add stations to owners
        while (stations.length) {
            let owner = this.stationsOwners[this.getRandom(0, this.stationsOwners.length)];
            dataSource.users.map((user: IUser) => {
                if (user.role === 'owner' && stations.length) {
                    user.stations.push({
                        address: stations.splice(0, 1)[0],
                        balance: this.getRandom(100, 1000),
                        tariffs: []
                    });
                }
            });            
        }
        
        
        // add operations
        let startDate = new Date(2018, 3, 1);
        for (let k = 0; k < 500; k++) {
            let hour = 3600000;
            let day = 86400000;
            let hours = startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours();
            let minutes = startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes();
            let date = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
            let month = (startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
            let year = startDate.getFullYear();
            let operation = this.operations[this.getRandom(0, this.operations.length)];
            dataSource.operations.push({
                type: operation,
                operator: operators[this.getRandom(0, operators.length)],
                date: `${hours}:${minutes} ${date}.${month}.${year}`
            });
            startDate = new Date(Number(startDate) + this.getRandom(hour, day));
        };

        return dataSource;
    }
}