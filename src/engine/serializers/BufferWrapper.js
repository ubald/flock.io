"use strict";

export default class BufferWrapper {

    buffer = null;
    offset = 0;
    
    constructor(buffer) {
        this.buffer = buffer;
    }

    readInt8() {
        const v = this.buffer.readInt8( this.offset );
        this.offset += 1;
        return v;
    }

    readUint8() {
        const v = this.buffer.readUInt8( this.offset );
        this.offset += 1;
        return v;
    }

    readInt16() {
        const v = this.buffer.readInt16BE( this.offset );
        this.offset += 2;
        return v;
    }

    readUint16() {
        const v = this.buffer.readUInt16BE( this.offset );
        this.offset += 2;
        return v;
    }

    readInt32() {
        const v = this.buffer.readInt32BE( this.offset );
        this.offset += 4;
        return v;
    }

    readUint32() {
        const v = this.buffer.readUInt32BE( this.offset );
        this.offset += 4;
        return v;
    }

    readFloat32() {
        const v = this.buffer.readFloatBE( this.offset );
        this.offset += 4;
        return v;
    }

    readFloat64() {
        const v = this.buffer.readDoubleBE( this.offset );
        this.offset += 8;
        return v;
    }

    writeInt8( v ) {
        this.buffer.writeInt8( this.offset, v );
        this.offset += 1;
    }

    writeUint8( v ) {
        this.buffer.writeUInt8( this.offset, v );
        this.offset += 1;
    }

    writeInt16( v ) {
        this.buffer.writeInt16BE( this.offset, v );
        this.offset += 2;
    }

    writeUint16( v ) {
        this.buffer.writeUInt16BE( this.offset, v );
        this.offset += 2;
    }

    writeInt32( v ) {
        this.buffer.writeInt32BE( this.offset, v );
        this.offset += 4;
    }

    writeUint32( v ) {
        this.buffer.writeUInt32BE( this.offset, v );
        this.offset += 4;
    }

    writeFloat32( v ) {
        this.buffer.writeFloatBE( this.offset, v );
        this.offset += 4;
    }

    writeFloat64( v ) {
        this.buffer.writeDoubleBE( this.offset, v );
        this.offset += 8;
    }
}