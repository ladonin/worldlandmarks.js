var aaa = require('./aaa');


class B extends aaa{
    methB(){ return this.methA()}
}

module.exports = B;
