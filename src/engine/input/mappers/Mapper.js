"use strict";

export default class Mapper {

    static test(controller) {
        throw new Error('Please implement the static test method in you mapper subclass.');
    }
    
    static map(controller, state) {
        throw new Error('Please override the map method in you mapper subclass.');
    }
}