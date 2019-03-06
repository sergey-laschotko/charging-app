import { stations } from "./stations";

export const getRandom = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let startDate = new Date(2019, 0, 1);
let hour = 3600000;
let day = 86400000;

let list = [];
let balance = [];

let operations = ["Зарядка", "Бронь", "Продажа токенов", "Покупка токeнов"];

for (let i = 0; i < 300; i++) {
    let hours = startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours();
    let minutes = startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes();
    let date = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
    let month = (startDate.getMonth() + 1) < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
    let year = startDate.getFullYear();

    list.push({
        station: stations[getRandom(0, stations.length - 1)],
        date: `${hours}:${minutes} ${date}.${month}.${year}`,
        operation: operations[getRandom(0, operations.length - 1)]
    });

    startDate = new Date(Number(startDate) + getRandom(hour, day));
}

for (let i = 0; i < stations.length; i++) {
    balance.push({
        station: stations[i],
        balance: getRandom(100, 10000)
    });
}

export const stationsBalance = balance;

export const journal = list;