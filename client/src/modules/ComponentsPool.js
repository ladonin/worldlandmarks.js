/*
 * File src/modules/ComponentsPool.js
 * import ComponentsPool from 'src/modules/ComponentsPool';
 *
 * Keeps componentr instances refs
 */

let _refs = {};

export default {

    setRef(name, ref)
    {
        _refs[name] = ref;
    },


    get(name)
    {
        return _refs[name];
    },


    remove(name)
    {
        delete _refs[name];
    }
}