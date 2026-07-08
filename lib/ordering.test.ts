import { describe, it, expect } from 'vitest'
import { getTailOrder, getInsertOrder, rebalanceOrders, ORDER_STEP } from './ordering'

describe('ordering helpers', () => {
  describe('getTailOrder', () => {
    it('returns step when lastOrder is undefined', () => {
      expect(getTailOrder()).toBe(ORDER_STEP)
    })

    it('returns lastOrder + step when lastOrder is a number', () => {
      expect(getTailOrder(1500)).toBe(1500 + ORDER_STEP)
      expect(getTailOrder(0)).toBe(ORDER_STEP)
    })
  })

  describe('getInsertOrder', () => {
    it('returns step when both prevOrder and nextOrder are undefined', () => {
      const result = getInsertOrder(undefined, undefined)
      expect(result).toEqual({ order: ORDER_STEP, requiresRebalance: false })
    })

    it('returns nextOrder - step when prevOrder is undefined', () => {
      const result = getInsertOrder(undefined, 2500)
      expect(result).toEqual({ order: 2500 - ORDER_STEP, requiresRebalance: false })
    })

    it('returns prevOrder + step when nextOrder is undefined', () => {
      const result = getInsertOrder(1500, undefined)
      expect(result).toEqual({ order: 1500 + ORDER_STEP, requiresRebalance: false })
    })

    it('returns midpoint when both are defined', () => {
      const result = getInsertOrder(1000, 2000)
      expect(result).toEqual({ order: 1500, requiresRebalance: false })
    })

    it('returns requiresRebalance: true when midpoint equals prevOrder or nextOrder (fractional limit)', () => {
      const result = getInsertOrder(1000, 1001)
      expect(result.requiresRebalance).toBe(true)
    })
  })

  describe('rebalanceOrders', () => {
    it('reassigns order in sequential steps', () => {
      const items = [
        { id: '1', order: 12 },
        { id: '2', order: 99 },
        { id: '3', order: 3 },
      ]
      const result = rebalanceOrders(items)
      expect(result).toEqual([
        { id: '1', order: ORDER_STEP },
        { id: '2', order: ORDER_STEP * 2 },
        { id: '3', order: ORDER_STEP * 3 },
      ])
    })
  })
})
