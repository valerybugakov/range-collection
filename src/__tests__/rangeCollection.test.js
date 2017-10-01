import RangeCollection from '../index'

const testCollection = testOperation => ({ init, altered, expected }) => {
  const rc = new RangeCollection()
  rc.setRanges(init)
  rc[testOperation](altered)

  expect(rc.getRanges()).toEqual(expected)
}

const testAddition = testCollection('add')
const testDeletion = testCollection('remove')

describe('RangeCollection', () => {
  describe('Should add correctly', () => {
    it('Adds to empty collection', () => {
      testAddition({
        init: [],
        altered: [1, 5],
        expected: [[1, 5]],
      })
    })

    it('Adds to non empty collection', () => {
      testAddition({
        init: [[1, 5]],
        altered: [10, 20],
        expected: [[1, 5], [10, 20]],
      })
    })

    it('Adds nothing for empty range', () => {
      testAddition({
        init: [[1, 5], [10, 20]],
        altered: [20, 20],
        expected: [[1, 5], [10, 20]],
      })
    })

    it('Adds nothing if fully overlapping', () => {
      testAddition({
        init: [[1, 5], [10, 21]],
        altered: [2, 4],
        expected: [[1, 5], [10, 21]],
      })
    })

    it('Adds non overlapping piece', () => {
      testAddition({
        init: [[1, 5], [10, 20]],
        altered: [20, 21],
        expected: [[1, 5], [10, 21]],
      })

      testAddition({
        init: [[1, 5], [10, 20]],
        altered: [3, 8],
        expected: [[1, 8], [10, 20]],
      })
    })

    it('Merges overlapping interval', () => {
      testAddition({
        init: [[1, 5], [10, 12], [10, 20]],
        altered: [1, 100],
        expected: [[1, 100]],
      })
    })
  })

  describe('Should remove correctly', () => {
    it('Removes nothing for empty range', () => {
      testDeletion({
        init: [[1, 5]],
        altered: [3, 3],
        expected: [[1, 5]],
      })
    })

    it('Removes range', () => {
      testDeletion({
        init: [[1, 5]],
        altered: [4, 5],
        expected: [[1, 4]],
      })
    })

    it('Removes multiple ranges', () => {
      testDeletion({
        init: [[1, 5], [10, 12], [15, 20]],
        altered: [8, 30],
        expected: [[1, 5]],
      })
    })

    it('Removes overlapping pieces', () => {
      testDeletion({
        init: [[1, 5], [10, 12], [15, 20]],
        altered: [3, 11],
        expected: [[1, 3], [11, 12], [15, 20]],
      })
    })
  })

  describe('Should add and remove correctly', () => {
    it('Adds and removes overlapping pieces', () => {
      const rc = new RangeCollection()

      rc.add([20, 50])
      rc.add([70, 80])
      rc.remove([30, 75])

      expect(rc.getRanges()).toEqual([[20, 30], [75, 80]])
    })
  })
})
