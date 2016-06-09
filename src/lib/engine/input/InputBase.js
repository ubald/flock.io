"use strict";

import {Subject} from 'rxjs';

export default class InputBase {

    constructor( world ) {
        this._world = world;

        this._buttonPressedSubject  = new Subject();
        this._buttonReleasedSubject = new Subject();
        this._buttonDownSubject     = new Subject();
        this._axesSubject           = new Subject();
        this._keyPressSubject       = new Subject();
        this._keyDownSubject        = new Subject();
        this._keyUpSubject          = new Subject();
    }

    get controllers() {
        return this._controllers;
    }

    get buttonPressed() {
        return this._buttonPressedSubject;
    }

    get buttonReleased() {
        return this._buttonReleasedSubject;
    }

    get buttonDown() {
        return this._buttonDownSubject;
    }

    get axes() {
        return this._axesSubject;
    }

    get keyPress() {
        return this._keyPressSubject;
    }

    get keyDown() {
        return this._keyDownSubject;
    }

    get keyUp() {
        return this._keyUpSubject;
    }

    update() {

    }
}