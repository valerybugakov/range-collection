// @flow
// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5).
// This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

/**
 * RangeCollection class
 * NOTE: Feel free to add any extra member variables/functions you like.
 */

type RangeType = [number, number]
type RangesType = Array<RangeType>

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export default class RangeCollection {
  ranges: RangesType;

  static validateRange(range: RangeType) {
    invariant(Array.isArray(range), 'Range should be an array')
    invariant(range.length === 2, 'Range should contain 2 elements')

    const [start, end] = range

    invariant(range.every(Number.isInteger), 'Range elemnts should be integers')
    invariant(start <= end, 'Range start should be lower or equal to range end')
  }

  constructor() {
    this.ranges = []
  }

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range: RangeType) {
    RangeCollection.validateRange(range)

    let i = 0
    let newRange = range
    const { ranges } = this
    const updatedRanges = []
    const [newRangeStart, newRangeEnd] = newRange

    // Add all the ranges ending before newRangeStart
    while (i < ranges.length && ranges[i][1] < newRangeStart) {
      updatedRanges.push(ranges[i++])
    }

    // Merge all overlapping ranges
    while (i < ranges.length && ranges[i][0] <= newRangeEnd) {
      newRange = [
        Math.min(newRangeStart, ranges[i][0]),
        Math.max(newRangeEnd, ranges[i][1]),
      ]

      i++
    }

    // Add newRange
    updatedRanges.push(newRange)

    // Add the rest of the ranges
    while (i < ranges.length) {
      updatedRanges.push(ranges[i++])
    }

    this.ranges = updatedRanges
  }

  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(removeRange: RangeType) {
    RangeCollection.validateRange(removeRange)
    const [removeStart, removeEnd] = removeRange

    // Check if removeRange is empty
    if (removeStart === removeEnd) return

    this.ranges = this.ranges.reduce((ranges, range) => {
      const [start, end] = range

      // Add non overlapping range
      if (removeEnd < start || removeStart > end) {
        ranges.push(range)

        return ranges
      }

      // Delete fully overllaping range
      if (removeStart < start && removeEnd > end) {
        return ranges
      }

      // Shorten range from 1 side
      if (removeStart <= start && removeEnd <= end) {
        ranges.push([removeEnd, end])
      }
      if (removeStart >= start && removeEnd >= end) {
        ranges.push([start, removeStart])
      }

      // Split range into 2 pieces
      if (removeStart > start && removeEnd < end) {
        ranges.push([start, removeStart])
        ranges.push([removeEnd, end])

        return ranges
      }

      return ranges
    }, [])
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    console.log(this.ranges.map(range => `[${range.toString()})`).join(' '))
  }

  setRanges(ranges: RangesType) {
    this.ranges = ranges
  }

  getRanges() {
    return this.ranges
  }
}
