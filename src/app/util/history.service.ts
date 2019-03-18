import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class HistoryService {
    private uri = "http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=0xA59b4fe50dE0841Da51eF381eD317dE11bd79d12&startblock=0&endblock=99999999&sort=asc&apikey=5W8UAG1HXW2HDKBS6ET9TG5TNWYZV6QI9P";

    constructor(private http: HttpClient) {}
    
    getHistory() {
        return this.http.get(this.uri);
    }
}