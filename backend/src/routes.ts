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
            res.json(result);
        })
        .catch(e => {
            console.log("Getting Total Supply: " + e.message);
        });
});

router.post("/get-balance", (req, res) => {
    const address = req.body.address;
    erc20tokenService.getBalance(address)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Getting balance: " + e.message)
        });
});

router.post("/buy-tokens", async (req, res) => {
    const amount = req.body.amount;
    const address = req.body.address;
    const result = erc20tokenService.buyTokens(amount, address);
    result
        .then((r: any) => {
            res.json(r);
        })
        .catch((e: any) => {
            console.log(`Buying Tokens Error: ${e}`);
            res.json(false);
        })
});

router.post("/mint", (req, res) => {
    const amount = req.body.amount;
    erc20tokenService.mint(amount)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Minting: " + e.message);
        });
});

router.post("/burn", (req, res) => {
    const amount = req.body.amount;
    erc20tokenService.burn(amount)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Burning: " + e.message);
        });
});

router.post("/start-charging", (req, res) => {
    const address = req.body.address;
    chargerService.startCharging(address)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Starting charging: " + e.message);
        });
});

router.post("/add-rate", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const rate = req.body.rate;
    const addr = req.body.address;
    chargerService.addRate(from, to, rate, addr)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Adding rate: " + e.message);
        });
});

router.post("/reserve", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const address = req.body.address;

    chargerService.reserve(from, to, address)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Reserving: " + e.message);
        });
});

router.post("/create-charger", (req, res) => {
    const address = req.body.address;
    const name = req.body.name;
    const owner = req.body.owner;
    
    factoryService.createCharger(address, name, owner)
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Creating charger: " + e.message);
        });
});

router.get("/history", (req, res) => {
    historyService.getHistory()
        .then((result: any) => {
            res.json(result.data.result);
        })
        .catch(e => {
            console.log("Getting history: " + e.message);
        });
});

router.get("/show-chargers", (req, res) => {
    registerService.showChargers()
        .then((result: any) => {
            res.json(result);
        })
        .catch(e => {
            console.log("Showing chargers: " + e.message);
        });
});

export default router;