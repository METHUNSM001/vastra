import test from "node:test";
import assert from "node:assert/strict";
import { resolveRemoteCollection } from "./dataLoadStrategy.js";

test("keeps an intentionally empty backend collection instead of resetting to demo data", () => {
  assert.deepEqual(resolveRemoteCollection([], [{ id: "fallback" }]), []);
});

test("falls back to local demo data only when the backend result is missing", () => {
  assert.deepEqual(resolveRemoteCollection(null, [{ id: "fallback" }]), [{ id: "fallback" }]);
  assert.deepEqual(resolveRemoteCollection(undefined, [{ id: "fallback" }]), [{ id: "fallback" }]);
});
