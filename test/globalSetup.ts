import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended"

import prisma from "db"

jest.mock("db", () => ({
  __esModule: true,
  default: mockDeep<typeof prisma>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<typeof prisma>
