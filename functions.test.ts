const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    it('return an array with the same length as the input array', () => {
        const input = [1, 2, 3, 4, 5]
        const output = shuffleArray(input)
        expect(output.length).toEqual(input.length)
    })
    
    it('return a shuffled version of the input array', () => {
        const input = [1, 2, 3, 4, 5]
        const output = shuffleArray(input)
        expect(output).not.toEqual(input)
    })
})