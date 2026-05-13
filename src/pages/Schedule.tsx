import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

type Task = { time: string; text: string };

const SCHEDULE: Record<string, Task[]> = {
  Monday: [
    { time: "8:00–9:00am", text: "LinkedIn content. Write and schedule tomorrow's post" },
    { time: "9:00–10:00am", text: "Job search outbound sequence to hiring managers/sales managers" },
    { time: "10:00–11:00am", text: "Job search outbound sequence to SDRs/AEs" },
    { time: "11:00–11:30am", text: "Break / lunch" },
    { time: "11:30am–1:00pm", text: "Reddit/SEO/AEO block" },
    { time: "1:00–2:00pm", text: "Get ready for work" },
    { time: "2:00–11:00pm", text: "Restaurant shift" },
  ],
  Tuesday: [
    { time: "8:00–9:00am", text: "LinkedIn content. Write and schedule tomorrow's post" },
    { time: "9:00–10:00am", text: "Job search outbound sequence to hiring managers/sales managers" },
    { time: "10:00–11:00am", text: "Job search outbound sequence to SDRs/AEs" },
    { time: "11:00–11:30am", text: "Break / lunch" },
    { time: "11:30am–1:00pm", text: "Reddit/SEO/AEO block" },
    { time: "1:00–2:00pm", text: "Admin. Update job search tracker, log call outcomes, follow up on leads" },
    { time: "3:00–4:30pm", text: "Get ready for work" },
    { time: "4:30–11:00pm", text: "Restaurant shift" },
  ],
  Wednesday: [
    { time: "8:00–9:00am", text: "LinkedIn content. Write and schedule tomorrow's post" },
    { time: "9:00–10:00am", text: "Job search outbound sequence to hiring managers/sales managers" },
    { time: "10:00–11:00am", text: "Job search outbound sequence to SDRs/AEs" },
    { time: "11:00–11:30am", text: "Break / lunch" },
    { time: "11:30am–1:00pm", text: "Reddit/SEO/AEO block" },
    { time: "2:00–3:00pm", text: "CadenceAI strategy" },
    { time: "3:00–4:00pm", text: "Interview prep. STAR stories, CadenceAI practice sessions, company research" },
    { time: "5:00–6:00pm", text: "Dinner / personal time" },
    { time: "6:00–8:00pm", text: "Deep work block. Apollo list building, content batching, SOPs, etc" },
  ],
  Thursday: [
    { time: "8:00–9:00am", text: "LinkedIn content. Write and schedule tomorrow's post" },
    { time: "9:00–10:00am", text: "Job search outbound sequence to hiring managers/sales managers" },
    { time: "10:00–11:00am", text: "Job search outbound sequence to SDRs/AEs" },
    { time: "11:00–11:30am", text: "Break / lunch" },
    { time: "11:30am–1:00pm", text: "Reddit/SEO/AEO block" },
    { time: "2:00–3:00pm", text: "CadenceAI strategy" },
    { time: "3:00–4:00pm", text: "Interview prep. STAR stories, CadenceAI practice sessions, company research" },
    { time: "5:00–6:00pm", text: "Dinner / personal time" },
    { time: "6:00–8:00pm", text: "Deep work block. Apollo list building, content batching, SOPs, etc" },
  ],
  Friday: [
    { time: "8:00–9:00am", text: "LinkedIn content" },
    { time: "9:00–10:00am", text: "Job search outbound sequence to hiring managers/sales managers" },
    { time: "10:00–11:30am", text: "Job search outbound sequence to SDRs/AEs" },
    { time: "11:30am–12:00pm", text: "Break / lunch" },
    { time: "12:00–1:30pm", text: "Reddit/SEO/AEO block" },
    { time: "1:30–2:00pm", text: "Week wrap-up. Log outcomes, set Monday priorities, review what content performed, etc" },
    { time: "3:00–4:30pm", text: "Get ready for work" },
    { time: "4:30–11:00pm", text: "Restaurant shift" },
  ],
  Saturday: [
    { time: "8:00–9:00am", text: "Morning routine and weekly review. MRR, calls booked, LinkedIn impressions, Reddit traction" },
    { time: "9:00–11:00am", text: "Reddit/SEO/AEO block. Schedule Reddit posts, update SEO drafts, keyword research" },
    { time: "11:00am–12:00pm", text: "Studying. Sales methodology, cold email optimization, interview prep" },
    { time: "12:00–1:30pm", text: "Break / lunch" },
    { time: "1:30–3:15pm", text: "Get ready for work" },
    { time: "3:15–11:00pm", text: "Restaurant shift" },
  ],
  Sunday: [
    { time: "8:00–9:00am", text: "Morning routine and weekly planning. Set priorities" },
    { time: "9:00–11:00am", text: "Big task block. Hiring, partnerships outreach, product improvements, SOPs" },
    { time: "11:00am–12:00pm", text: "Studying. SDR interview prep, Gong research, cold email frameworks" },
    { time: "12:00–1:30pm", text: "Break / lunch" },
    { time: "1:30–2:15pm", text: "Week prep" },
    { time: "2:15–3:15pm", text: "Get ready for work" },
    { time: "3:15–11:00pm", text: "Restaurant shift" },
  ],
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDisplayDate(): Date {
  const today = new Date();
  const start = new Date(2026, 4, 20); // May 20, 2026
  const end = new Date(2026, 5, 20);   // June 20, 2026
  if (today < start) return start;
  if (today > end) return end;
  return today;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function dateKey(d: Date) {
  return `schedule-checklist-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function Schedule() {
  const today = useMemo(() => getDisplayDate(), []);
  const todayName = DAY_NAMES[today.getDay()];
  const [selectedDay, setSelectedDay] = useState<string>(todayName);
  const tasks = SCHEDULE[selectedDay] || [];
  const isToday = selectedDay === todayName;
  const storageKey = isToday ? dateKey(today) : `schedule-checklist-preview-${selectedDay}`;

  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
      else setChecked({});
    } catch {
      setChecked({});
    }
  }, [storageKey]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const completedCount = tasks.filter((_, i) => checked[i]).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Daily Checklist</p>
            <h1 className="text-4xl font-bold mb-1">{selectedDay}</h1>
            <p className="text-muted-foreground">
              May 20 – June 20
              {isToday && <span className="ml-2 text-xs uppercase tracking-wider text-primary">Today</span>}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/crm">
              <Briefcase className="h-4 w-4 mr-1" /> Open CRM
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {DAY_NAMES.map((day, idx) => {
            const active = day === selectedDay;
            const isTodayBtn = day === todayName;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center justify-center py-3 rounded-lg border text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-muted border-border text-foreground"
                }`}
              >
                <span>{dayShort[idx]}</span>
                {isTodayBtn && (
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full ${active ? "bg-primary-foreground" : "bg-primary"}`} />
                )}
              </button>
            );
          })}
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Today's progress</CardTitle>
              <span className="text-sm text-muted-foreground">
                {completedCount} / {tasks.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {tasks.map((task, i) => {
                const isChecked = !!checked[i];
                return (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-4 hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => toggle(i)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggle(i)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium text-muted-foreground ${isChecked ? "line-through" : ""}`}>
                        {task.time}
                      </p>
                      <p className={`text-base ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Checklist resets each day. Progress saved locally.
        </p>
      </div>
    </div>
  );
}
