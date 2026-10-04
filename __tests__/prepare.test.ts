import { expect, it } from "vitest";
import { createTestSession, says, when } from "../src/index.js";

it("prepares responses without sending prompts so the host can drive the session", async () => {
  const t = await createTestSession();
  try {
    t.prepare(when("Hello", [says("Hello from the host-driven session.")]));
    expect(t.events.messages).toHaveLength(0);
    await t.session.prompt("Hello");
    await t.session.agent.waitForIdle();
    expect(t.playbook).toEqual({ consumed: 1, remaining: 0 });
    expect(t.events.messages.some(m => m.role === "assistant")).toBe(true);
  } finally {
    t.dispose();
  }
});
