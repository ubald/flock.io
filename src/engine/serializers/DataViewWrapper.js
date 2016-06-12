"use strict";

export default class DataViewWrapper {

    dv = null;
    offset = 0;
    
    constructor(data) {
        this.dv = new DataView( data );
    }

    readInt8() {
        const v = this.dv.getInt8( this.offset );
        this.offset += 1;
        return v;
    }

    readUint8() {
        const v = this.dv.getUint8( this.offset );
        this.offset += 1;
        return v;
    }

    readInt16() {
        const v = this.dv.getInt16( this.offset, false );
        this.offset += 2;
        return v;
    }

    readUint16() {
        const v = this.dv.getUint16( this.offset, false );
        this.offset += 2;
        return v;
    }

    readInt32() {
        const v = this.dv.getInt32( this.offset, false );
        this.offset += 4;
        return v;
    }

    readUint32() {
        const v = this.dv.getUint32( this.offset, false );
        this.offset += 4;
        return v;
    }

    readFloat32() {
        const v = this.dv.getFloat32( this.offset, false );
        this.offset += 4;
        return v;
    }

    readFloat64() {
        const v = this.dv.getFloat64( this.offset, false );
        this.offset += 8;
        return v;
    }

    writeInt8( v ) {
        this.dv.setInt8( this.offset, v );
        this.offset += 1;
    }

    writeUint8( v ) {
        this.dv.setUint8( this.offset, v );
        this.offset += 1;
    }

    writeInt16( v ) {
        this.dv.setInt16( this.offset, v, false );
        this.offset += 2;
    }

    writeUint16( v ) {
        this.dv.setUint16( this.offset, v, false );
        this.offset += 2;
    }

    writeInt32( v ) {
        this.dv.setInt32( this.offset, v, false );
        this.offset += 4;
    }

    writeUint32( v ) {
        this.dv.setUint32( this.offset, v, false );
        this.offset += 4;
    }

    writeFloat32( v ) {
        this.dv.setFloat32( this.offset, v, false );
        this.offset += 4;
    }

    writeFloat64( v ) {
        this.dv.setFloat64( this.offset, v, false );
        this.offset += 8;
    }
}