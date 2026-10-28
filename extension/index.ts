/**
 * Claude Code chrome for omp.
 *
 * omp has no agent_settled (request boundary), so one footer is emitted per
 * agent run (agent_start ... agent_end). Rendered through the public
 * registerMessageRenderer path used by custom messages.
 */
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

const VERBS = [
  "Baked", "Brewed", "Churned", "Cogitated", "Cooked", "Crunched", "Sautéed", "Worked",
] as const;

const MIN_MS = 1000;

function formatDuration(ms: number): string {
  const elapsed = Math.max(0, ms);
  if (elapsed < 60_000) return `${Math.floor(elapsed / 1000)}s`;
  let seconds = Math.round((elapsed % 60_000) / 1000);
  let minutes = Math.floor((elapsed % 3_600_000) / 60_000);
  const hours = Math.floor(elapsed / 3_600_000);
  if (seconds === 60) { seconds = 0; minutes += 1; }
  return hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
}

interface FooterDetails { ms: number; verb: string }

let startedAt = 0;
let verb: string = "Worked";

/** Minimal Component duck type: a renderer only needs render(width). */
function row(text: string) {
  return {
    render: (_width: number) => [text],
    invalidate: () => {},
  };
}

export default function claudeCodeChrome(pi: ExtensionAPI): void {
  pi.on("agent_start", () => {
    if (startedAt !== 0) return; // continuation run keeps the request clock
    startedAt = Date.now();
    verb = VERBS[Math.floor(Math.random() * VERBS.length)] ?? "Worked";
  });

  pi.on("agent_end", () => {
    if (startedAt === 0) return;
    const ms = Date.now() - startedAt;
    startedAt = 0;
    if (ms < MIN_MS) return;
    pi.sendMessage<FooterDetails>(
      {
        customType: "cc-turn-footer",
        content: [{ type: "text", text: "" }],
        display: true,
        details: { ms, verb },
      },
      { triggerTurn: false },
    );
  });

  pi.registerMessageRenderer<FooterDetails>("cc-turn-footer", (message, _options, theme) => {
    const data = (message.details ?? { ms: 0, verb: "Worked" }) as FooterDetails;
    return row(theme.fg("dim", ` ✻ ${data.verb} for ${formatDuration(data.ms)}`));
  });
}
