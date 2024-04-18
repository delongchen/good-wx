import { describe, test, expect } from 'vitest'
import {createScanner} from "@/core/teller/rule/scan.ts";

describe('test expression', () => {
  test('scan', () => {
    expect(createScanner("$self[0:].up * 3 + 'some'").scanTokens()).toBe(null)
  })

  test('literal', () => {

  })

  test('str plus', () => {
  })
})
