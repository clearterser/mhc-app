"use client";

import Link from "next/link";
import {
  Landmark,
  ScrollText,
  Frame,
  Globe,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Users,
  Award,
  Gem,
  Heart,
  ArrowRight,
} from "lucide-react";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Map dict-side icon keys to lucide components.
const ICON_BY_KEY = {
  venue: Landmark,
  gerege: ScrollText,
  wall: Frame,
  wallweb: Frame,
  online: Globe,
  lifetime: BadgeCheck,
  events: CalendarDays,
  education: GraduationCap,
  member: Users,
  certificate: Award,
  limited: Gem,
};

export function TierBenefitsDrawer({
  tier,
  tierStyles,
  labels,
  donateHref,
  contactHref,
}) {
  const limited = tier.limited;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            "h-10 rounded-xl px-5 text-white shadow-md",
            tierStyles.triggerClass
          )}
        >
          <Gem className="size-4" />
          {labels.viewBenefits}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[88vh]">
        <div className="mx-auto flex w-full max-w-2xl flex-col overflow-y-auto">
          <DrawerHeader className="text-left">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md",
                  tierStyles.iconClass
                )}
              >
                <Gem className="size-6" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <DrawerTitle className="text-lg">
                    {tier.drawerTitle}
                  </DrawerTitle>
                  {limited ? (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        tierStyles.limitedBadgeClass
                      )}
                    >
                      {labels.limitedBadgeTemplate.replace(
                        "{n}",
                        String(limited)
                      )}
                    </span>
                  ) : null}
                </div>
                <DrawerDescription className="mt-1">
                  {tier.drawerDescription}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-2">
            <ul className="grid gap-3 sm:grid-cols-2">
              {tier.benefits.map((benefit, i) => {
                const Icon = ICON_BY_KEY[benefit.icon] ?? BadgeCheck;
                return (
                  <li
                    key={`${benefit.title}-${i}`}
                    className="flex gap-3 rounded-xl border border-border bg-card p-3.5 ring-1 ring-foreground/5"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm",
                        tierStyles.iconClass
                      )}
                    >
                      <Icon className="size-4.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-tight">
                        {benefit.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <DrawerFooter className="flex-row">
            <Button
              asChild
              className="h-11 flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
            >
              <Link href={donateHref}>
                <Heart className="size-4" />
                {labels.drawerDonateCta}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 flex-1 rounded-xl">
              <Link href={contactHref}>
                {labels.drawerContactCta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </DrawerFooter>

          <DrawerClose asChild>
            <button className="mb-4 px-4 text-center text-xs text-muted-foreground hover:text-foreground">
              {labels.drawerClose}
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
