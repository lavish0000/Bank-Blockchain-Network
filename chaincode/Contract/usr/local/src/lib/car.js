'use strict';

const State = require('../ledger-api/state.js.js');

const {cpState} = require('./../../../util/constants');

class Car extends State {
    
    constructor(obj) {
        super(Car.getClass(), [obj.issuer, obj.carNumber]);
        Object.assign(this, obj);
    }

    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    setIssued() {
        this.currentState = cpState.ISSUED;
    }

    setOpen() {
        this.currentState = cpState.OPEN;
    }

    setSold() {
        this.currentState = cpState.Sold;
    }

    setSellingPrize(price) {
        this.sellingPrize = price;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isOpen() {
        return this.currentState === cpState.OPEN;
    }

    isSold() {
        return this.currentState === cpState.Sold;
    }

    static fromBuffer(buffer) {
        return Car.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Car);
    }

    static createInstance(issuer, carNumber, issueDateTime, openTime, basePrice) {
        return new Car({issuer, carNumber, issueDateTime, openTime, basePrice});
    }

    static getClass() {
        return 'org.carauction.car'
    }
}

module.exports = Car