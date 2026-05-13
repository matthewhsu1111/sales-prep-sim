import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, Trash2, Download, ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Linkedin, Building2 } from "lucide-react";

const CATEGORIES = [
  { id: "hiring_managers", label: "Hiring Managers" },
  { id: "sales_managers", label: "Sales Managers" },
  { id: "sdrs_aes", label: "SDRs / AEs" },
] as const;
type CategoryId = typeof CATEGORIES[number]["id"];

const STAGES = [
  "LinkedIn Connect",
  "LinkedIn DM",
  "Email 1",
  "Email 2",
  "Email 3",
  "Email 4",
  "Cold Call / Voicemail",
  "Cold Call / Voicemail 2",
] as const;
type Stage = typeof STAGES[number];

type Lead = {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  notes?: string;
  category: CategoryId;
  stage: Stage;
};

const STORAGE_KEY = "crm-leads-v1";
const uid = () => Math.random().toString(36).slice(2, 10);

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) return [];
  const splitRow = (row: string) => {
    const out: string[] = [];
    let cur = ""; let inQ = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"') {
        if (inQ && row[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === "," && !inQ) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur); return out;
  };
  const headers = splitRow(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = (cells[i] || "").trim(); });
    return obj;
  });
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    for (const rk of Object.keys(row)) {
      if (rk.replace(/[\s_-]/g, "") === k.replace(/[\s_-]/g, "")) {
        if (row[rk]) return row[rk];
      }
    }
  }
  return "";
}

const CRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeCat, setActiveCat] = useState<CategoryId>("hiring_managers");
  const [uploadCat, setUploadCat] = useState<CategoryId>("hiring_managers");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLeads(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); } catch {}
  }, [leads]);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCSV(text);
    const newLeads: Lead[] = rows.map((r) => ({
      id: uid(),
      name: pick(r, ["name", "fullname", "firstname"]) || (pick(r, ["first name"]) + " " + pick(r, ["last name"])).trim(),
      title: pick(r, ["title", "jobtitle", "position"]),
      company: pick(r, ["company", "organization", "employer"]),
      email: pick(r, ["email", "emailaddress"]),
      phone: pick(r, ["phone", "phonenumber", "mobile"]),
      linkedin: pick(r, ["linkedin", "linkedinurl", "profile"]),
      notes: pick(r, ["notes", "note"]),
      category: uploadCat,
      stage: STAGES[0],
    })).filter((l) => l.name && l.name.trim().length > 1);
    setLeads((prev) => [...prev, ...newLeads]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addBlank = () => {
    const id = uid();
    setLeads((prev) => [...prev, { id, name: "New Lead", category: activeCat, stage: STAGES[0] }]);
    setExpandedId(id);
  };

  const updateLead = (id: string, patch: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
  };
  const removeLead = (id: string) => setLeads((prev) => prev.filter((l) => l.id !== id));

  const exportCSV = () => {
    const headers = ["name", "title", "company", "email", "phone", "linkedin", "category", "stage", "notes"];
    const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const body = leads.map((l) => headers.map((h) => esc((l as any)[h] || "")).join(",")).join("\n");
    const csv = headers.join(",") + "\n" + body;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "crm-leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => leads.filter((l) => l.category === activeCat), [leads, activeCat]);
  const byStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    STAGES.forEach((s) => { map[s] = []; });
    filtered.forEach((l) => { (map[l.stage] ||= []).push(l); });
    return map;
  }, [filtered]);

  const onDrop = (stage: Stage) => {
    if (dragId) updateLead(dragId, { stage });
    setDragId(null); setDragOverStage(null);
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div>
            <Link to="/schedule" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-1">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Schedule
            </Link>
            <h1 className="text-3xl font-bold">CRM</h1>
          </div>
          <div className="flex gap-2 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Upload to</label>
              <Select value={uploadCat} onValueChange={(v) => setUploadCat(v as CategoryId)}>
                <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <Button size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> Upload CSV
            </Button>
            <Button size="sm" variant="outline" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" variant="outline" onClick={addBlank}>
              <Plus className="h-4 w-4 mr-1" /> Add Lead
            </Button>
          </div>
        </div>

        <Tabs value={activeCat} onValueChange={(v) => setActiveCat(v as CategoryId)}>
          <TabsList className="mb-4">
            {CATEGORIES.map((c) => {
              const count = leads.filter((l) => l.category === c.id).length;
              return (
                <TabsTrigger key={c.id} value={c.id}>
                  {c.label} <Badge variant="secondary" className="ml-2">{count}</Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STAGES.map((stage) => {
              const isOver = dragOverStage === stage;
              return (
                <div
                  key={stage}
                  onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage); }}
                  onDragLeave={() => setDragOverStage((s) => s === stage ? null : s)}
                  onDrop={() => onDrop(stage)}
                  className={`w-[280px] shrink-0 rounded-lg border bg-muted/30 transition-colors ${isOver ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="px-3 py-2.5 border-b border-border sticky top-0 bg-muted/60 backdrop-blur rounded-t-lg flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{stage}</h3>
                    <Badge variant="outline" className="h-5">{byStage[stage]?.length || 0}</Badge>
                  </div>
                  <div className="p-2 space-y-2 min-h-[120px]">
                    {(byStage[stage] || []).map((lead) => {
                      const expanded = expandedId === lead.id;
                      const subtitle = [lead.title, lead.company].filter(Boolean).join(" · ");
                      return (
                        <Card
                          key={lead.id}
                          draggable={!expanded}
                          onDragStart={(e) => { setDragId(lead.id); e.dataTransfer.effectAllowed = "move"; }}
                          onDragEnd={() => { setDragId(null); setDragOverStage(null); }}
                          className={`bg-card cursor-grab active:cursor-grabbing transition-opacity ${dragId === lead.id ? "opacity-50" : ""}`}
                        >
                          <CardContent className="p-2.5">
                            <div className="flex items-start justify-between gap-1">
                              <button
                                onClick={() => setExpandedId(expanded ? null : lead.id)}
                                className="flex-1 text-left min-w-0"
                              >
                                <div className="font-semibold text-sm truncate">{lead.name || "Unnamed"}</div>
                                {subtitle && <div className="text-xs text-muted-foreground truncate">{subtitle}</div>}
                              </button>
                              <button
                                onClick={() => setExpandedId(expanded ? null : lead.id)}
                                className="text-muted-foreground hover:text-foreground p-0.5"
                                aria-label="Toggle"
                              >
                                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>
                            </div>

                            {!expanded && (lead.email || lead.phone || lead.linkedin) && (
                              <div className="flex gap-2 mt-1.5 text-muted-foreground">
                                {lead.email && <Mail className="h-3 w-3" />}
                                {lead.phone && <Phone className="h-3 w-3" />}
                                {lead.linkedin && <Linkedin className="h-3 w-3" />}
                              </div>
                            )}

                            {expanded && (
                              <div className="mt-2 space-y-1.5">
                                <Input className="h-7 text-xs" placeholder="Name" value={lead.name} onChange={(e) => updateLead(lead.id, { name: e.target.value })} />
                                <Input className="h-7 text-xs" placeholder="Title" value={lead.title || ""} onChange={(e) => updateLead(lead.id, { title: e.target.value })} />
                                <Input className="h-7 text-xs" placeholder="Company" value={lead.company || ""} onChange={(e) => updateLead(lead.id, { company: e.target.value })} />
                                <Input className="h-7 text-xs" placeholder="Email" value={lead.email || ""} onChange={(e) => updateLead(lead.id, { email: e.target.value })} />
                                <Input className="h-7 text-xs" placeholder="Phone" value={lead.phone || ""} onChange={(e) => updateLead(lead.id, { phone: e.target.value })} />
                                <Input className="h-7 text-xs" placeholder="LinkedIn" value={lead.linkedin || ""} onChange={(e) => updateLead(lead.id, { linkedin: e.target.value })} />
                                <Input className="h-7 text-xs" placeholder="Notes" value={lead.notes || ""} onChange={(e) => updateLead(lead.id, { notes: e.target.value })} />
                                <div className="flex justify-between items-center pt-1">
                                  <Select value={lead.stage} onValueChange={(v) => updateLead(lead.id, { stage: v as Stage })}>
                                    <SelectTrigger className="h-7 text-xs w-[170px]"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {STAGES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeLead(lead.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                    {(byStage[stage]?.length || 0) === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-6">Drop leads here</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
