class A {
    methA(){console.log('aaaaaaaaaaaa');

        let trace = new Error().stack;
            // Crop unnecessary lines
            trace = trace.replace(/at Module\._compile(?:.*?[\n\r]?)*/i,'');
console.log(trace);
console.log('bbbbbbbb');

}
}

module.exports = A;
