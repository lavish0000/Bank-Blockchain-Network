'use strict';

const StateList = require('../ledger-api/statelist.js.js');

const Car = require('./car.js.js');

class CarList extends StateList {
    
    constructor() {
        super(ctx, 'org.carauction.carlist')
        this.use(Car);
    }

    async addCar(car) {
        return this.addState(car);
    }

    async getCar(carKey) {
        return this.getState(carKey);
    }

    async updateCar(car) {
        return this.updateState(car);
    }
}


module.exports = CarList;