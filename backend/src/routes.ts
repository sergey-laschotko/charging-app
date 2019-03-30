import express from "express";
import { Web3Service } from "./services/web3.service";
import { RegisterService } from "./services/register.service";
import { HistoryService } from "./services/history.service";
import { FactoryService } from "./services/factory.service";
import { ERC20TokenService } from "./services/erc20Token.service";
import { ChargerService } from "./services/charger.service";

const web3Service = new Web3Service();
const erc20tokenService = new ERC20TokenService(web3Service);
const historyService = new HistoryService();
const chargerService = new ChargerService(web3Service, erc20tokenService);
const registerService = new RegisterService(web3Service, chargerService, erc20tokenService); 
const factoryService = new FactoryService(web3Service);

const router = express.Router();

router.get("/user", (req, res) => {
    const user = erc20tokenService.getUser();
    res.json(user);
});

router.get("/station-owner", (req, res) => {
    const stationOwner = erc20tokenService.getStationOwner();
    res.json(stationOwner);
});

router.get("/service-owner", (req, res) => {
    const serviceOwner = erc20tokenService.getServiceOwner();
    res.json(serviceOwner);
});

router.get("/total-supply", (req, res) => {
    erc20tokenService.totalSupply()
        .then((result: any) => {
            res.json(parseInt(result["_hex"], 16));
        });
});

router.post("/get-balance", (req, res) => {
    const address = req.body.address;
    console.log(address);
    erc20tokenService.getBalance(address)
        .then((result: any) => {
            res.json(parseInt(result["_hex"], 16));
        });
});

router.post("/buy-tokens", (req, res) => {
    const amount = req.body.amount;
    const address = req.body.address;
    erc20tokenService.buyTokens(amount, address)
        .then((result: any) => {
            res.json(result);
        });
});

router.post("/mint", (req, res) => {
    const amount = req.body.amount;
    erc20tokenService.mint(amount)
        .then((result: any) => {
            res.json(result);
        });
});

router.post("/burn", (req, res) => {
    const amount = req.body.amount;
    erc20tokenService.burn(amount)
        .then((result: any) => {
            res.json(result);
        });
});

router.post("/start-charging", (req, res) => {
    const address = req.body.address;
    chargerService.startCharging(address)
        .then((result: any) => {
            res.json(result);
        });
});

router.post("/add-rate", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const rate = req.body.rate;
    chargerService.addRate(from, to, rate)
        .then((result: any) => {
            res.json(result);
        });
});

router.post("/reserve", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const address = req.body.address;

    chargerService.reserve(from, to, address)
        .then((result: any) => {
            res.json(result);
        });
});

router.post("/create-charger", (req, res) => {
    const address = req.body.address;
    const name = req.body.name;
    const owner = req.body.owner;
    
    factoryService.createCharger(address, name, owner)
        .then((result: any) => {
            res.json(result);
        });
});

router.get("/history", (req, res) => {
    historyService.getHistory()
        .then((result: any) => {
            res.json(result.data.result);
        });
});

router.get("/show-chargers", (req, res) => {
    registerService.showChargers()
        .then((result: any) => {
            res.json(result);
        });
});

export default router;