"use client";

import { motion } from "motion/react";
import {
  Crown,
  Briefcase,
  FolderKanban,
  UsersRound,
  UserCog,
  Users,
} from "lucide-react";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Maps to dict.governance.nodes keys
const TREE = {
  key: "board",
  role: "Эрх барих дээд байгууллага",
  icon: Crown,
  children: [
    { key: "advisory", role: "Зөвлөх байгууллага", icon: Users },
    {
      key: "secretary",
      role: "УЗ-ийн ажлын алба",
      icon: Briefcase,
      children: [
        { key: "team", role: "Төслийн баг", icon: FolderKanban },
        {
          key: "director",
          role: "Гүйцэтгэх удирдлага",
          icon: UsersRound,
          children: [
            {
              key: "manager",
              role: "Менежментийн багийн ахлагч",
              icon: UserCog,
              children: [
                {
                  key: "volunteers",
                  role: "Гүйцэтгэх ажилтнууд",
                  icon: Users,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function NodeCard({ node, dict, depth }) {
  const Icon = node.icon;
  const isRoot = depth === 0;
  const data = dict[node.key];
  const title = data?.title ?? node.key;
  const subtitle = data?.subtitle ?? node.role;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: Math.min(depth, 5) * 0.08,
      }}
    >
      <Card
        size="sm"
        className={cn(
          "flex-row items-center gap-3 px-4 shadow-sm transition-shadow hover:shadow-md",
          isRoot &&
            "border border-amber-500/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30"
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm",
            isRoot
              ? "bg-gradient-to-br from-amber-500 to-orange-500"
              : "bg-gradient-to-br from-amber-400 to-orange-400"
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <CardTitle className="text-sm leading-tight">{title}</CardTitle>
          {subtitle ? (
            <CardDescription className="mt-0.5 text-xs leading-snug">
              {subtitle}
            </CardDescription>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}

function TreeNode({ node, dict, depth }) {
  const children = node.children ?? [];
  return (
    <>
      <NodeCard node={node} dict={dict} depth={depth} />
      {children.length > 0 ? (
        <ul className="relative mt-4 space-y-4">
          {children.map((child) => (
            <li
              key={child.key}
              className={cn(
                "relative pl-6 sm:pl-8",
                "before:absolute before:top-[-1rem] before:left-1 before:h-10 before:w-5 before:rounded-bl-lg before:border-b-2 before:border-l-2 before:border-border before:content-[''] sm:before:left-1.5 sm:before:w-6",
                "after:absolute after:top-6 after:bottom-[-1rem] after:left-1 after:border-l-2 after:border-border after:content-[''] last:after:hidden sm:after:left-1.5"
              )}
            >
              <TreeNode node={child} dict={dict} depth={depth + 1} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function OrgChart({ dict }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5 ring-1 ring-foreground/10 sm:p-8">
      <div className="min-w-[18rem]">
        <TreeNode node={TREE} dict={dict} depth={0} />
      </div>
    </div>
  );
}
