import { cn } from "@/lib/utils";

interface TeamCardLink {
  label: string;
  href: string;
}

interface TeamCardMember {
  name: string;
  role: string;
  bio: string;
  links: TeamCardLink[];
}

interface TeamCardProps {
  member: TeamCardMember;
  editHint?: string;
  className?: string;
}

export function TeamCard({ member, editHint, className }: TeamCardProps) {
  const hasPlaceholderLink = member.links.some((l) => l.href === "#");
  const showEditBadge = Boolean(editHint) && hasPlaceholderLink;
  const initial = (member.name.replace(/[^A-Za-z0-9]/g, "")[0] ?? "?").toUpperCase();

  return (
    <article
      className={cn(
        "corner-accent flex flex-col gap-4 border border-border bg-background-elev/40 p-6",
        className,
      )}
    >
      {showEditBadge && (
        <div className="font-mono text-[10px] uppercase tracking-wider text-warning">
          {editHint}
        </div>
      )}

      <div className="flex items-center gap-4">
        <AvatarPlaceholder initial={initial} />
        <div className="min-w-0">
          <h3 className="text-h3 leading-tight">{member.name}</h3>
          <p className="font-mono text-sm text-foreground-muted">
            {member.role}
          </p>
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed">{member.bio}</p>

      {member.links.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {member.links.map((link) => {
            const isPlaceholder = link.href === "#";
            const isExternal = link.href.startsWith("http");
            return (
              <span
                key={link.label}
                className="inline-flex items-center gap-2"
              >
                <a
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer noopener" : undefined}
                  className="font-mono text-xs text-accent hover:underline"
                >
                  → {link.label}
                </a>
                {isPlaceholder && editHint && (
                  <span className="font-mono text-xs text-warning">
                    {editHint}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      )}
    </article>
  );
}

function AvatarPlaceholder({ initial }: { initial: string }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      role="img"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="0.5"
        y="0.5"
        width="55"
        height="55"
        rx="3"
        className="fill-background-elev stroke-border"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground-muted"
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.06em",
        }}
      >
        {initial}
      </text>
    </svg>
  );
}
