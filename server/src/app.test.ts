import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "./app.ts";
import {
  ADMIN_EMAIL,
  WAITER_EMAIL,
  loginAs,
  seedTestData,
  startTestDb,
  stopTestDb,
} from "./test/testDb.ts";

let shiftId: string;

beforeAll(async () => {
  await startTestDb();
  ({ shiftId } = await seedTestData());
});

afterAll(stopTestDb);

describe("open routes", () => {
  it("answers the health check without login", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("answers unknown API paths with a JSON 404", async () => {
    const response = await request(app).get("/api/nope");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Not found: GET /api/nope");
  });
});

describe("access rules", () => {
  const rules = [
    { path: "/api/shifts", waiter: 403 },
    { path: "/api/employees", waiter: 403 },
    { path: "/api/attendance", waiter: 403 },
    { path: "/api/tables", waiter: 200 },
  ];

  it.each(rules)("$path: nobody 401, waiter $waiter, admin 200", async ({ path, waiter }) => {
    const waiterAgent = await loginAs(WAITER_EMAIL);
    const adminAgent = await loginAs(ADMIN_EMAIL);

    expect((await request(app).get(path)).status).toBe(401);
    expect((await waiterAgent.get(path)).status).toBe(waiter);
    expect((await adminAgent.get(path)).status).toBe(200);
  });

  it("rejects a waiter token whose role was edited to admin", async () => {
    const waiterAgent = await loginAs(WAITER_EMAIL);
    const me = await waiterAgent.get("/api/auth/me");
    const realToken = jwt.sign({ userId: me.body.id, role: "waiter" }, "test-secret");
    const [header, , signature] = realToken.split(".");
    const editedPayload = Buffer.from(
      JSON.stringify({ userId: me.body.id, role: "admin" }),
    ).toString("base64url");

    const response = await request(app)
      .get("/api/employees")
      .set("Cookie", `token=${header}.${editedPayload}.${signature}`);

    expect(response.status).toBe(401);
  });
});

describe("data shape", () => {
  it("sends employees with their shift and id instead of _id", async () => {
    const adminAgent = await loginAs(ADMIN_EMAIL);
    const response = await adminAgent.get("/api/employees");
    const [employee] = response.body;

    expect(response.body).toHaveLength(1);
    expect(employee).toMatchObject({
      id: expect.any(String),
      name: "Zoe Reed",
      shiftId,
      employmentDate: "2021-03-25T00:00:00.000Z",
      shift: { id: shiftId, name: "A", startTime: "06:00", endTime: "14:00" },
    });
    expect(employee).not.toHaveProperty("_id");
    expect(employee).not.toHaveProperty("__v");
  });

  it("finds one shift by id and answers 404 for a bad id", async () => {
    const adminAgent = await loginAs(ADMIN_EMAIL);

    expect((await adminAgent.get(`/api/shifts/${shiftId}`)).body.name).toBe("A");
    expect((await adminAgent.get("/api/shifts/123")).status).toBe(404);
  });
});
