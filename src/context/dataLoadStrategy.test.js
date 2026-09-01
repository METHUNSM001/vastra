import test from "node:test";
import assert from "node:assert/strict";
import { resolveRemoteCollection } from "./dataLoadStrategy.js";
import { getCategorySeedForId, normalizeCategorySlug } from "../services/supabase.js";

test("keeps an intentionally empty backend collection instead of resetting to demo data", () => {
  assert.deepEqual(resolveRemoteCollection([], [{ id: "fallback" }]), []);
});

test("falls back to local demo data only when the backend result is missing", () => {
  assert.deepEqual(resolveRemoteCollection(null, [{ id: "fallback" }]), [{ id: "fallback" }]);
  assert.deepEqual(resolveRemoteCollection(undefined, [{ id: "fallback" }]), [{ id: "fallback" }]);
});

test("creates a valid category seed when the database is empty", () => {
  const category = getCategorySeedForId("sarees");
  assert.equal(category.id, "sarees");
  assert.equal(category.name_en, "Sarees");
  assert.equal(category.name_ta, "புடவைகள்");
});

test("normalizes human-readable category names into stable database ids", () => {
  assert.equal(normalizeCategorySlug("Bridal Muhurtham Collections"), "bridal-muhurtham-collections");
  assert.equal(normalizeCategorySlug("  Festive Chanderi & Soft Silk  "), "festive-chanderi-soft-silk");
});
