"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Inbox,
  ListTodo,
  Plus,
  Rocket,
  Sparkles,
  Target,
  TimerReset,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

type Todo = {
  id: string;
  title: string;
  note: string;
  completed: boolean;
  createdAt: string;
};

type TodoFormState = {
  title: string;
  note: string;
};

type Stat = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
};

const emptyForm: TodoFormState = {
  title: "",
  note: "",
};

const createTodo = (todo: Omit<Todo, "id" | "createdAt">): Todo => ({
  ...todo,
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
});

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(() => [
    createTodo({
      title: "Kurasi roadmap mingguan tim",
      note: "Soroti inisiatif berdampak dan tag stakeholder penting.",
      completed: false,
    }),
    createTodo({
      title: "Rilis versi beta fitur baru",
      note: "Pastikan dokumentasi handoff ke QA sudah sinkron.",
      completed: true,
    }),
    createTodo({
      title: "Siapkan konten update komunitas",
      note: "Tambahkan visualisasi progres dan highlight angka terbaru.",
      completed: false,
    }),
  ]);
  const [form, setForm] = useState<TodoFormState>(emptyForm);
  const celebrationTriggeredRef = useRef(false);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );
  const remainingCount = todos.length - completedCount;
  const hasTodos = todos.length > 0;
  const hasCompleted = completedCount > 0;
  const hasCompletedAll = hasTodos && remainingCount === 0;
  const isFormValid = form.title.trim().length > 0;

  const stats = useMemo<Stat[]>(
    () => [
      {
        label: "Total tugas",
        value: todos.length,
        icon: ListTodo,
        accent:
          "from-emerald-400/80 via-primary/70 to-sky-500/80 text-emerald-50",
      },
      {
        label: "Sedang jalan",
        value: remainingCount,
        icon: Target,
        accent:
          "from-amber-400/80 via-orange-500/70 to-pink-500/80 text-orange-50",
      },
      {
        label: "Selesai hebat",
        value: completedCount,
        icon: Rocket,
        accent:
          "from-primary/80 via-indigo-500/75 to-fuchsia-500/75 text-indigo-50",
      },
    ],
    [todos.length, remainingCount, completedCount]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) return;

    setTodos((prev) => [
      createTodo({
        title: form.title.trim(),
        note: form.note.trim(),
        completed: false,
      }),
      ...prev,
    ]);
    setForm(emptyForm);
  };

  const toggleTodo = (id: string, checked: boolean | "indeterminate") => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: checked === true } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!hasCompletedAll) {
      celebrationTriggeredRef.current = false;
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }

    if (celebrationTriggeredRef.current) {
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }

    celebrationTriggeredRef.current = true;

    const launchConfetti = async () => {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 160,
        startVelocity: 42,
        spread: 85,
        gravity: 0.6,
        scalar: 0.9,
        origin: { y: 0.65 },
        decay: 0.92,
      });
      timeout = setTimeout(() => {
        confetti({
          particleCount: 120,
          startVelocity: 36,
          spread: 120,
          ticks: 200,
          gravity: 0.6,
          scalar: 1.1,
          origin: { y: 0.5 },
          decay: 0.9,
          colors: ["#8B5CF6", "#22D3EE", "#FBBF24", "#F472B6"],
        });
      }, 240);
    };

    void launchConfetti();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [hasCompletedAll]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-16 font-sans">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-glow absolute -top-32 left-1/2 h-[860px] w-[860px] -translate-x-1/2 blur-3xl" />
        <div className="absolute right-[-20%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,oklch(0.75_0.2_290)_0%,transparent_60%)] opacity-60 blur-3xl" />
        <div className="absolute left-[-25%] bottom-[-10%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_70%_70%,oklch(0.7_0.23_40)_0%,transparent_70%)] opacity-55 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.98_0_0)/0.07_0%,transparent_60%)]" />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
        <section className="flex flex-col gap-4 text-center sm:text-left">
          <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/80 shadow-lg backdrop-blur md:self-start">
            <Sparkles className="size-3 animate-floaty text-primary" />
            Produktivitas Harian
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground drop-shadow-sm sm:text-5xl md:text-6xl">
            To-Do List
          </h1>
          <p className="text-pretty text-base text-muted-foreground sm:text-lg">
            Kelola daftar tugas, monitor momentum inisiatif, dan hadirkan
            visibilitas progres yang terasa premium.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={cn(
                  "glass-panel neon-border flex flex-col gap-3 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_45px_-18px] hover:shadow-primary/50 focus-within:-translate-y-2",
                  index % 2 === 0 ? "animate-floaty" : undefined
                )}
                style={{ animationDelay: `${index * 0.35}s` }}
              >
                <div
                  className={cn(
                    "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium backdrop-blur",
                    "bg-gradient-to-r shadow-[0_0_0_1px_rgba(255,255,255,0.15)]",
                    item.accent
                  )}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                </div>
                <p className="text-3xl font-semibold text-foreground">
                  {item.value.toLocaleString("id-ID")}
                </p>
                <span className="text-xs text-muted-foreground">
                  Pembaruan real time untuk sprint kali ini.
                </span>
              </div>
            );
          })}
        </section>

        <Card className="relative glass-panel neon-border w-full overflow-hidden rounded-3xl border border-white/5 bg-background/50">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-32 w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.9_0.24_240)/0.25_0%,transparent_70%)] blur-3xl sm:block" />
          <CardHeader className="relative gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-left">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
                <Rocket className="size-6 text-primary" />
                To-Do List
              </CardTitle>
              <CardDescription>
                Tambahkan tugas baru, beri catatan, dan tandai progress kamu.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <Badge
                variant="secondary"
                className={cn(
                  "gap-2 bg-white/10 text-foreground shadow-inner backdrop-blur",
                  hasCompletedAll &&
                    "border border-emerald-400/40 bg-emerald-500/20 text-emerald-50 shadow-lg"
                )}
              >
                <Circle className="size-3 text-amber-400" />
                <span className="font-medium">{remainingCount}</span> berjalan
              </Badge>
              <Badge
                className={cn(
                  "gap-2 bg-primary/80 text-primary-foreground shadow",
                  hasCompletedAll && "animate-floaty border border-white/20"
                )}
              >
                <CheckCircle2 className="size-3" />
                <span className="font-medium">{completedCount}</span> selesai
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <form
              className="orbits grid gap-4 rounded-2xl border border-dashed border-white/10 bg-background/60 p-4 shadow-inner transition-all hover:border-white/20 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:items-start md:gap-6 md:p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-2">
                <Label htmlFor="todo-title" className="text-sm font-medium">
                  Judul tugas
                </Label>
                <Input
                  id="todo-title"
                  placeholder="Contoh: Sinkronisasi roadmap kuartal"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-3 sm:col-span-1">
                <div className="grid gap-2">
                  <Label htmlFor="todo-note" className="text-sm font-medium">
                    Catatan (opsional)
                  </Label>
                  <Textarea
                    id="todo-note"
                    placeholder="Detail tambahan, link referensi, atau niat utama misi."
                    value={form.note}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        note: event.target.value,
                      }))
                    }
                    rows={3}
                    className="min-h-0 sm:min-h-[96px]"
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid}
                className={cn(
                  "group relative w-full justify-center overflow-hidden rounded-xl sm:h-12 sm:self-stretch md:h-12 sm:col-span-2",
                  "bg-gradient-to-r from-primary via-indigo-500 to-fuchsia-500 text-primary-foreground shadow-lg transition-all",
                  "hover:shadow-[0_0_35px_-10px_rgba(129,140,248,0.8)]"
                )}
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,white/20,transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Plus className="size-4" />
                Tambah
              </Button>
            </form>

            <div className="space-y-3">
              {hasTodos ? (
                <ul className="space-y-3">
                  {todos.map((todo) => (
                    <li key={todo.id}>
                      <article
                        className={cn(
                          "group relative overflow-hidden rounded-2xl border border-white/10 bg-background/65 p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_60px_-28px_rgba(80,140,255,0.6)]",
                          todo.completed &&
                            "border-emerald-400/40 bg-primary/5 text-muted-foreground"
                        )}
                      >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex flex-1 gap-3">
                            <Checkbox
                              id={`todo-${todo.id}`}
                              checked={todo.completed}
                              onCheckedChange={(checked) =>
                                toggleTodo(todo.id, checked)
                              }
                              className="mt-1"
                              aria-label={`Tandai ${todo.title}`}
                            />
                            <div className="space-y-2">
                              <Label
                                htmlFor={`todo-${todo.id}`}
                                className={cn(
                                  "text-base font-medium leading-tight text-foreground",
                                  todo.completed && "text-muted-foreground"
                                )}
                              >
                                {todo.title}
                              </Label>
                              {todo.note && (
                                <p className="text-sm text-muted-foreground">
                                  {todo.note}
                                </p>
                              )}
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                                Dibuat{" "}
                                {new Date(todo.createdAt).toLocaleString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-start">
                            <Badge
                              variant={todo.completed ? "secondary" : "outline"}
                              className={cn(
                                "gap-2 border-transparent text-foreground shadow-sm",
                                todo.completed
                                  ? "bg-emerald-500/20 text-emerald-50"
                                  : "bg-white/5 text-foreground"
                              )}
                            >
                              {todo.completed ? (
                                <>
                                  <CheckCircle2 className="size-3" />
                                  Selesai
                                </>
                              ) : (
                                <>
                                  <Circle className="size-3" />
                                  Proses
                                </>
                              )}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeTodo(todo.id)}
                              className="text-muted-foreground transition-colors hover:text-destructive hover:shadow-[0_0_0_1px_rgba(255,99,132,0.35)]"
                              aria-label={`Hapus ${todo.title}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="glass-panel neon-border flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-background/70 py-12 text-center">
                  <div className="grid place-items-center rounded-full border border-white/15 bg-white/10 p-4 shadow-inner">
                    <Inbox className="size-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">
                      Belum ada todo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tambahkan tugas pertama untuk mulai produktif hari ini.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter
            className={cn(
              "flex-wrap justify-between gap-3 border-t border-white/10 bg-background/70 py-4",
              hasCompletedAll &&
                "bg-gradient-to-r from-primary/10 via-indigo-500/5 to-fuchsia-500/10"
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                hasCompletedAll && "text-primary-foreground/80 drop-shadow-sm"
              )}
            >
              {hasCompletedAll ? (
                <>
                  <Sparkles className="size-4 text-primary" />
                  Semua tugas selesai! Saatnya recharge energi ⚡️
                </>
              ) : (
                <>
                  <TimerReset className="size-4 text-primary" />
                  {remainingCount > 0
                    ? `Masih ada ${remainingCount} tugas menunggu untuk diselesaikan.`
                    : "Semua tugas selesai! Waktu untuk beristirahat sejenak 🎉"}
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!hasCompleted}
                onClick={clearCompleted}
                className={cn(
                  "rounded-full border border-white/10 bg-white/5 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 disabled:opacity-40",
                  hasCompletedAll &&
                    "border-transparent bg-primary/80 text-primary-foreground shadow-lg hover:bg-primary/90"
                )}
              >
                Bersihkan tugas selesai
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
