'use strict';

const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Car = require('./car');
const CarList = require('./carList');
const {cpState} = require('./../../../util/constants');


class CarContext extends Context {

    constructor() {
        super();
        this.carList = new CarList(this);
    }
}


class CarContract extends Contract {
    constructor() {
        super('org.carauction.car');
    }

    createContext() {
        return new CarContext();
    }

    async instantiate(ctx) {
        console.log("instantiate the contract");
    }

    async issue(ctx, issuer, carNumber, issueDateTime, openTime, basePrice) {

        let car = Car.createInstance(issuer, carNumber, issueDateTime, openTime, basePrice);

        car.setIssued();

        car.setOwner(issuer);

        car.setSellingPrize(0);

        await ctx.carList.addCar(car);

        return car;
    }
    
    async setForAuction(ctx, issuer, carNumber, owner) {

        let carKey = Car.makeKey([issuer, carNumber]);
        let car = await ctx.carList.getCar(carKey);

        if (!car) {
            throw new Error(`Car not found with car number: ${carNumber} and carOwner: ${issuer}`);
        }

        const currentState = await car.getCurrentState();

        if (car.owner === owner && car.issuer === owner) {
            throw new Error(`You are not authorised to perform this action`);
        }

        if (currentState === cpState.OPEN) {
            throw new Error(`Car ${carNumber} is already open for auction`);
        }

        if (currentState === cpState.Sold) {
            throw new Error(`Car ${carNumber} is sold`);
        }

        car.setOpen();

        await ctx.carList.updateCar(car);

        return car;
    }

    async makeBid(ctx, issuer, carNumber, newOwner, bidPrice, purchaseDateTime) {

        let carKey = Car.makeKey([issuer, carNumber]);
        let car = await ctx.carList.getCar(carKey);

        if (!car) {
            throw new Error(`Car not found with car number: ${carNumber} and carOwner: ${issuer}`);
        }

        const currentState = await car.getCurrentState();

        if (currentState !== cpState.OPEN) {
            throw new Error(`Car ${carNumber} is not open for auction`);
        }

        if (currentState === cpState.OPEN && car.openTime < Date().toString()) {
            throw new Error(`Auction for car ${carNumber} is expired`);
        }

        if (car.basePrice > bidPrice || car.sellingPrize > bidPrice) {
            throw new Error(`Bid Higher`);
        }

        car.setOwner(newOwner);
        car.setSellingPrize(bidPrice);

        await ctx.carList.updateCar(car);

        return car;
    }
}

module.exports = {CarContract};
