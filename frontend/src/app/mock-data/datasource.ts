import { IUser, IOperation } from "./models";
import { formatDate, genID } from "../../lib/lib";

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

const BUYING = "Покупка токенов";
const SALING = "Продажа токенов";
const CHARGING = "Зарядка";
const RESERVE = "Бронь";

export const operations = [BUYING, SALING, CHARGING, RESERVE];

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
                id: genID(),
                name: user, 
                role: 'user',
                balance: this.getRandom(5, 100)
            });
        });

        // add owners
        this.stationsOwners.forEach((owner: string) => {
            dataSource.users.push({ 
                id: genID(),
                name: owner, 
                role: 'owner',
                balance: this.getRandom(5, 100),
                stations: [],
            });
        });

        let stationsCopy = [...stations];

        // add stations to owners
        while (stationsCopy.length) {
            dataSource.users.map((user: IUser) => {
                if (user.role === 'owner' && stationsCopy.length) {
                    user.stations.push({
                        id: genID(),
                        address: stationsCopy.splice(0, 1)[0],
                        balance: this.getRandom(100, 1000),
                        tariffs: [
                            {
                                id: genID(),
                                from: "00:00",
                                to: "07:00",
                                price: this.getRandom(1, 3)
                            },
                            {
                                id: genID(),
                                from: "07:00",
                                to: "12:00",
                                price: this.getRandom(3, 5)
                            },
                            {
                                id: genID(),
                                from: "12:00",
                                to: "19:00",
                                price: this.getRandom(2, 4)
                            },
                            {
                                id: genID(),
                                from: "19:00",
                                to: "00:00",
                                price: this.getRandom(4, 6)
                            }
                        ]
                    });
                }
            });
        }

        // add operations
        let startDate = new Date(2018, 3, 1);
        for (let k = 0; k < 500; k++) {
            let hour = 3600000;
            let day = 86400000;
            let mockDate = formatDate(startDate);
            let reserveDate = formatDate(new Date(Number(startDate) + day));
            
            let operation = this.operations[this.getRandom(0, this.operations.length)];
            let data: string;
            let location: string = "";
            let randomStation = this.stations[this.getRandom(0, this.stations.length)];
            switch (operation) {
                case SALING:
                    data = `Продано ${this.getRandom(1, 10)} токенов`;
                    break;
                case BUYING:
                    data = `Куплено ${this.getRandom(1, 10)} токенов`;
                    break;
                case RESERVE:
                    data = `На ${reserveDate.hours}:${reserveDate.minutes} ${reserveDate.day}.${reserveDate.month}.${reserveDate.year} по адресу ${randomStation}`;
                    location = randomStation;
                    break;
                case CHARGING:
                    data = `${mockDate.hours}:${mockDate.minutes} ${mockDate.day}.${mockDate.month}.${mockDate.year} по адресу ${randomStation}`;
                    location = randomStation;
                    break;
                default:
                    return;
            }
            dataSource.operations.push({
                id: genID(),
                type: operation,
                operator: operators[this.getRandom(0, operators.length)],
                date: startDate,
                data: data,
                location: location
            });
            startDate = new Date(Number(startDate) + this.getRandom(hour, day));
        };

        return dataSource;
    }
}