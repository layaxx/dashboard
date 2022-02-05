import { hash256, SecurePassword } from "blitz"
import resetPassword from "./resetPassword"
import db from "db"

beforeEach(async () => {
  await db.$reset()
})

const mockCtx: any = {
  session: {
    $create: jest.fn,
  },
}

describe("resetPassword mutation", () => {
  it("works correctly", async () => {
    expect(true).toBe(true)

    // Create test user
    const goodToken = "randomPasswordResetToken"
    const expiredToken = "expiredRandomPasswordResetToken"
    const future = new Date()
    future.setHours(future.getHours() + 4)
    const past = new Date()
    past.setHours(past.getHours() - 4)

    const user = await db.user.create({
      data: {
        email: "user@example.com",
        tokens: {
          // Create old token to ensure it's deleted
          create: [
            {
              expiresAt: past,
              hashedToken: hash256(expiredToken),
              sentTo: "user@example.com",
              type: "RESET_PASSWORD",
            },
            {
              expiresAt: future,
              hashedToken: hash256(goodToken),
              sentTo: "user@example.com",
              type: "RESET_PASSWORD",
            },
          ],
        },
      },
      include: { tokens: true },
    })

    const newPassword = "newPassword"

    // Non-existent token
    await expect(
      resetPassword({ password: "", passwordConfirmation: "", token: "no-token" }, mockCtx)
    ).rejects.toThrowError()

    // Expired token
    await expect(
      resetPassword(
        { password: newPassword, passwordConfirmation: newPassword, token: expiredToken },
        mockCtx
      )
    ).rejects.toThrowError()

    // Good token
    await resetPassword(
      { password: newPassword, passwordConfirmation: newPassword, token: goodToken },
      mockCtx
    )

    // Delete's the token
    const numberOfTokens = await db.token.count({ where: { userId: user.id } })
    expect(numberOfTokens).toBe(0)

    // Updates user's password
    const updatedUser = await db.user.findFirst({ where: { id: user.id } })
    expect(await SecurePassword.verify(updatedUser!.hashedPassword, newPassword)).toBe(
      SecurePassword.VALID
    )
  })
})
