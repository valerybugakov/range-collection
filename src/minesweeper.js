import fs from 'fs'
import { invariant, compose } from './utils'

function readInputFile() {
  invariant(process.argv.length === 3, 'Incorrect arguments')

  try {
    return fs.readFileSync(process.argv[2], 'utf8').replace(/\r/g, '')
  } catch (err) {
    return invariant(false, 'Failed to read the file')
  }
}

function formatInput(input) {
  console.log(input)

  const containsOnlyAllowChars = /^[ \r\nXO]+$/.test(input)
  invariant(containsOnlyAllowChars, 'Only X and O symbols are allowed')

  const field = input.split('\n').filter(row => row.length)
  const firstRowLength = field[0].length
  const hasIncorrectRow = field.some(row => row.length !== firstRowLength)

  invariant(!hasIncorrectRow, 'Rows should have the same length')

  return field.map(row => row.split(' '))
}

function transformField(field) {
  const mine = 'X'
  const lucky = 'O'

  const height = field.length - 1
  const width = field[0].length - 1

  for (let y = 0; y <= height; y++) {
    const row = []

    for (let x = 0; x <= width; x++) {
      // For each lucky field count mines around
      if (field[y][x] === lucky) {
        let count = 0

        if (y > 0 && x > 0) {
          if (field[y - 1][x - 1] === mine) count++
        }

        if (y > 0) {
          if (field[y - 1][x] === mine) count++
        }

        if (y > 0 && x < width) {
          if (field[y - 1][x + 1] === mine) count++
        }

        if (x > 0) {
          if (field[y][x - 1] === mine) count++
        }

        if (x < width) {
          if (field[y][x + 1] === mine) count++
        }

        if (y < height && x > 0) {
          if (field[y + 1][x - 1] === mine) count++
        }

        if (y < height) {
          if (field[y + 1][x] === mine) count++
        }

        if (y < height && x < width) {
          if (field[y + 1][x + 1] === mine) count++
        }

        field[y][x] = count
      }

      row.push(field[y][x])
    }

    console.log(row.join(' '))
  }
}

compose(
  transformField,
  formatInput,
  readInputFile,
)()
