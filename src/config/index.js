'use strict';
const config = {
    'database': 'mongodb://localhost:27017/flagsDb',
    //Secret is used creating and verifing web tokens
    //Randomize ?
    'secret': 'secretPassToChangeAndToIgnore'
};
export default config;
