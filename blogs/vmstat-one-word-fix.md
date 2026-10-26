---
title: "One word, almost four years: fixing vmstat's context-switch average"
date: "2026-10-26"
excerpt: "vmstat's first line was under-reporting context switches by roughly 800x on my machine. The fix was changing a single word in procps, and it is now merged upstream."
tags: ["linux", "procps", "open-source", "c"]
---

`vmstat` ships on basically every Linux machine. It comes from **procps-ng**, the same package that gives you `ps`, `top`, `free` and `kill`. I recently got my first patch merged into it, and the whole fix was one word.

This is how I found it, why it was wrong, and how long it had been wrong.

## TL;DR

- The first line of `vmstat` reports averages *since boot*.
- The `cs` (context switches per second) column in that line was divided by the wrong thing.
- On my 8-CPU machine it printed **6** when the real value was about **5,077**.
- The bug shipped in every release from **procps-ng 4.0.3 (Feb 2023)** through **4.0.7 (Aug 2026)**.
- The fix: change `Div` to `uptime`. Merged upstream as [MR !310](https://gitlab.com/procps-ng/procps/-/merge_requests/310).

## The first line of vmstat is special

If you run `vmstat 1`, every line after the first is a delta: what happened in the last second. The **first** line is different. It is the average since the machine booted.

```
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
```

I was digging into how Linux reports system resources and checking `vmstat` against the raw counters the kernel exposes. The `cs` column on that first line said **6**. Six context switches per second? Even a mostly idle Linux box does hundreds.

## Checking by hand

The kernel keeps a running total of context switches in `/proc/stat` (the `ctxt` line), and seconds since boot in `/proc/uptime`. Average since boot is just one divided by the other:

```bash
awk '/^ctxt/{c=$2} END{print c}' /proc/stat   # 77209143
awk '{print $1}' /proc/uptime                  # ~15200
```

77,209,143 / 15,200 ≈ **5,077 context switches per second**. `vmstat` said 6. Off by a factor of about 800.

## Finding the line

The first-line math lives in `new_format()` in `src/vmstat.c`. Each column is computed right next to its neighbours, which made the bug easy to see once I was looking at it:

```c
V(10) = (unsigned)( SYSv(stat_INT) / uptime );   // in: interrupts/sec
V(11) = (unsigned)( SYSv(stat_CTX) / Div );      // cs: context switches/sec ???
```

`in` divides by `uptime`. `cs` divides by `Div`. So what is `Div`?

```c
Div = cpu_use + cpu_sys + cpu_idl + cpu_iow + cpu_sto;
```

`Div` is the total number of CPU *ticks* since boot, summed across **every** CPU. It exists to turn tick counts into the `us`/`sy`/`id` percentages. Roughly:

```
Div ≈ uptime × HZ × number_of_CPUs
    ≈ uptime × 100 × 8      (on my machine)
```

So dividing context switches by `Div` instead of `uptime` makes the result too small by `HZ × CPUs`, which is **~800x** on an 8-core box. That matches 6 versus 5,077 exactly.

## How long had it been there?

This is the part I found most interesting. I used `git log -L` to trace the history of that single line.

**Before 2023**, the line was:

```c
(unsigned)( (SYSv(stat_CTX) * hz + divo2) / Div )
```

Multiplying by `hz` cancels the `HZ` inside `Div`, but you are still dividing by the number of CPUs. So `cs` was too small by a factor of your core count. That shape goes back to at least 2011 in the git history. Someone reported it to Debian, and it became [procps issue #15](https://gitlab.com/procps-ng/procps/-/work_items/15).

**In January 2023**, a fix for issue #15 landed (commit `68e2c0fc`). It switched the since-boot averages for `si`, `so`, `bi`, `bo` and `in` to divide by `uptime`, which is correct. But for `cs`, only the `* hz` was removed, and the `/ Div` stayed. That turned a "too small by core count" bug into a "too small by 100x core count" bug. It shipped in **procps-ng 4.0.3** a month later, and stayed through every release up to 4.0.7.

Almost four years, in one of the most-installed tools on Linux, hiding in plain sight because the first line of `vmstat` is the one everyone ignores.

## The fix

```diff
 V(10) = (unsigned)( SYSv(stat_INT) / uptime );
-V(11) = (unsigned)( SYSv(stat_CTX) / Div );
+V(11) = (unsigned)( SYSv(stat_CTX) / uptime );
```

One word. After rebuilding:

```
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 0  2      0 1026008 416388 11563912 0    0   704  2635 4223 5377  3  2 69 26  0  0
```

5,377 matches `ctxt / uptime` for that boot, and it now sits sensibly next to `in`.

## Getting it upstream

I sent the patch to procps-ng as [MR !310](https://gitlab.com/procps-ng/procps/-/merge_requests/310), and it was merged on October 19, 2026. It will ship in the next procps-ng release.

## Check your own machine

Compare `vmstat`'s first `cs` value to:

```bash
echo $(( $(awk '/^ctxt/{print $2}' /proc/stat) / $(awk '{printf "%d", $1}' /proc/uptime) ))
```

If they are wildly different, your distro's procps has the bug.
