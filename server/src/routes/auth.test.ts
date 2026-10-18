import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../app.ts";
import {
  ADMIN_EMAIL,
  TEST_PASSWORD,
  loginAs,
  seedTestData,
  startTestDb,
  stopTestDb,
} from "../test/testDb.ts";

const tokenCookie = (payload: object, secret = "test-secret", expiresIn = 60) =>
  `token=${jwt.sign(payload, secret, { expiresIn })}`;

beforeAll(async () => {
  await startTestDb();
  await seedTestData();
});

afterAll(stopTestDb);

describe("POST /api/auth/login", () => {
  it("rejects a request without a body", async () => {
    const response = await request(app).post("/api/auth/login");

    expect(response.status).toBe(400);
  });

  it("rejects a non-string email so it cannot reach the database query", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: { $gt: "" }, password: TEST_PASSWORD });

    expect(response.status).toBe(400);
  });

  it("gives the same 401 for a wrong password and an unknown email", async () => {
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong" });
    const unknownEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "wrong" });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
    expect(wrongPassword.get("Set-Cookie")).toBeUndefined();
  });

  it("returns the public user and sets an httpOnly token cookie", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: ADMIN_EMAIL, password: TEST_PASSWORD });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      email: ADMIN_EMAIL,
      displayName: "Admin User",
      role: "admin",
    });
    expect(response.get("Set-Cookie")?.[0]).toMatch(/^token=.+HttpOnly/);
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 without a cookie", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("returns the logged-in user", async () => {
    const agent = await loginAs(ADMIN_EMAIL);
    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(ADMIN_EMAIL);
  });

  it("rejects a token signed with another secret", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", tokenCookie({ userId: "x", role: "admin" }, "wrong-secret"));

    expect(response.status).toBe(401);
  });

  it("rejects an expired token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", tokenCookie({ userId: "x", role: "admin" }, "test-secret", -60));

    expect(response.status).toBe(401);
  });

  it("returns 401 when the token's user no longer exists", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", tokenCookie({ userId: "000000000000000000000000", role: "admin" }));

    expect(response.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie so /me is 401 again", async () => {
    const agent = await loginAs(ADMIN_EMAIL);

    const logout = await agent.post("/api/auth/logout");
    const me = await agent.get("/api/auth/me");

    expect(logout.status).toBe(204);
    expect(me.status).toBe(401);
  });
});
