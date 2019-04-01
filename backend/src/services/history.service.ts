import axios from "axios";
const env = require("../../config/env");

export class HistoryService {
    private uri = env.historyAddress;

    constructor() {}
    
    getHistory(address: string) {
        return axios.get(`${this.uri}${address}`);
    }
}