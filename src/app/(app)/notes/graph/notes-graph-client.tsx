"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { NoteGraphEdge, NoteGraphNode } from "@/components/cross-ref/types";

type GraphPayload = { nodes: NoteGraphNode[]; edges: NoteGraphEdge[] };
type CyCore = import("cytoscape").Core;

function buildAdjacency(edges: { source: string; target: string }[]) {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    if (!adj.has(e.target)) adj.set(e.target, []);
    adj.get(e.source)!.push(e.target);
    adj.get(e.target)!.push(e.source);
  }
  return adj;
}

function nodesWithinHops(
  startId: string,
  edges: { source: string; target: string }[],
  maxHops: number,
): Set<string> {
  if (maxHops < 0) return new Set();
  const adj = buildAdjacency(edges);
  const included = new Set<string>([startId]);
  let boundary = new Set<string>([startId]);
  for (let d = 0; d < maxHops; d++) {
    const nextBoundary = new Set<string>();
    for (const u of boundary) {
      for (const v of adj.get(u) ?? []) {
        if (!included.has(v)) {
          included.add(v);
          nextBoundary.add(v);
        }
      }
    }
    boundary = nextBoundary;
  }
  return included;
}

function maxEdgeWeight(edges: NoteGraphEdge[]) {
  let m = 1;
  for (const e of edges) m = Math.max(m, e.weight);
  return m;
}

function truncateTitle(s: string, max = 28) {
  const t = s.trim() || "Untitled";
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

/** Cytoscape canvas rejects `lab()` / `oklch()` from raw `getPropertyValue`; probing `var(--x)` usually yields `rgb()`. */
function resolveCssVarColor(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1px;height:1px;visibility:hidden;pointer-events:none;";
  probe.style.setProperty("background-color", `var(${varName})`);
  document.documentElement.appendChild(probe);
  try {
    const v = getComputedStyle(probe).backgroundColor.trim();
    const safe =
      /^(rgb|rgba|hsl|hsla)\(/u.test(v) || /^#[0-9a-f]{3,8}$/iu.test(v);
    if (v && v !== "transparent" && v !== "rgba(0, 0, 0, 0)" && safe) {
      return v;
    }
  } finally {
    probe.remove();
  }
  return fallback;
}

export function NotesGraphClient() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<CyCore | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [payload, setPayload] = useState<GraphPayload | null>(null);

  const [minWeight, setMinWeight] = useState(1);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [focusDepth, setFocusDepth] = useState(2);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/notes/graph");
        if (!res.ok) {
          throw new Error(res.status === 401 ? "Sign in required." : "Could not load graph.");
        }
        const raw = (await res.json()) as unknown;
        if (
          !raw ||
          typeof raw !== "object" ||
          !Array.isArray((raw as GraphPayload).nodes) ||
          !Array.isArray((raw as GraphPayload).edges)
        ) {
          throw new Error("Invalid response.");
        }
        if (!cancelled) {
          setPayload(raw as GraphPayload);
          setStatus("ready");
        }
      } catch (e) {
        if (!cancelled) {
          setErrorMessage(e instanceof Error ? e.message : "Error");
          setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const weightMax = useMemo(
    () => (payload ? maxEdgeWeight(payload.edges) : 1),
    [payload],
  );

  const filteredModel = useMemo(() => {
    if (!payload) return { nodes: [] as NoteGraphNode[], edges: [] as NoteGraphEdge[] };
    const edgesPass = payload.edges.filter((e) => e.weight >= minWeight);
    if (!focusId) {
      return { nodes: payload.nodes, edges: edgesPass };
    }
    const inBall = nodesWithinHops(focusId, edgesPass, focusDepth);
    const nodes = payload.nodes.filter((n) => inBall.has(n.id));
    const nodeSet = new Set(nodes.map((n) => n.id));
    const edges = edgesPass.filter(
      (e) => nodeSet.has(e.source) && nodeSet.has(e.target),
    );
    return { nodes, edges };
  }, [payload, minWeight, focusId, focusDepth]);

  const filteredModelRef = useRef(filteredModel);
  filteredModelRef.current = filteredModel;

  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const applyLayout = useCallback((cy: CyCore, model: typeof filteredModel) => {
    const isDark = document.documentElement.classList.contains("dark");
    const fg = resolveCssVarColor(
      "--foreground",
      isDark ? "#fafaf9" : "#1c1917",
    );
    const primary = resolveCssVarColor("--primary", isDark ? "#d97757" : "#c2410c");
    const border = resolveCssVarColor("--border", isDark ? "#3f3f46" : "#e7e5e4");
    const labelColor = isDark ? "#ffffff" : "#000000";
    const labelColorSelected = isDark ? "#000000" : "#ffffff";

    cy.batch(() => {
      cy.elements().remove();
      if (model.nodes.length === 0) return;

      const els: import("cytoscape").ElementDefinition[] = [];
      for (const n of model.nodes) {
        els.push({
          group: "nodes",
          data: {
            id: n.id,
            label: truncateTitle(n.title),
            fullTitle: n.title,
            passageCount: n.passageCount,
          },
        });
      }
      for (const e of model.edges) {
        els.push({
          group: "edges",
          data: {
            id: `${e.source}|${e.target}`,
            source: e.source,
            target: e.target,
            weight: e.weight,
          },
        });
      }
      cy.add(els);

      cy.style()
        .selector("node")
        .style({
          label: "data(label)",
          "text-valign": "bottom",
          "text-halign": "center",
          "font-size": 10,
          color: labelColor,
          "text-margin-y": 6,
          width: 10,
          height: 10,
          "background-color": primary,
          "border-width": 1,
          "border-color": border,
        })
        .selector("node:selected")
        .style({
          "background-color": fg,
          "border-color": primary,
          "border-width": 2,
          color: labelColorSelected,
        })
        .selector("edge")
        .style({
          width: (ele: import("cytoscape").EdgeSingular) =>
            Math.min(8, 1 + (ele.data("weight") as number) * 0.6),
          "line-color": border,
          "curve-style": "bezier",
          opacity: 0.75,
          "target-arrow-shape": "none",
        })
        .update();
    });

    if (model.nodes.length === 0) return;

    cy.layout({
      name: "cose",
      animate: false,
      padding: 24,
      nodeRepulsion: () => 4500,
      idealEdgeLength: () => 90,
      gravity: 0.25,
    }).run();
    cy.minZoom(0.15);
    cy.maxZoom(2.5);
    cy.fit(undefined, 40);

    const sid = selectedIdRef.current;
    if (sid) {
      const el = cy.getElementById(sid);
      if (el.nonempty()) {
        cy.batch(() => {
          cy.elements().unselect();
          el.select();
        });
      }
    }
  }, []);

  useEffect(() => {
    if (status !== "ready" || !payload?.nodes.length) return;
    if (!containerRef.current) return;

    let cancelled = false;

    void import("cytoscape").then((mod) => {
      if (cancelled || !containerRef.current) return;
      cyRef.current?.destroy();
      const cytoscape = mod.default;
      const cy = cytoscape({
        container: containerRef.current,
      });
      cyRef.current = cy;

      cy.on("tap", "node", (evt) => {
        const id = evt.target.id();
        setSelectedId(id);
        cy.batch(() => {
          cy.elements().unselect();
          evt.target.select();
        });
      });
      cy.on("tap", (evt) => {
        if (evt.target === cy) {
          setSelectedId(null);
          cy.elements().unselect();
        }
      });
      cy.on("dbltap", "node", (evt) => {
        router.push(`/notes/${evt.target.id()}`);
      });

      applyLayout(cy, filteredModelRef.current);
    });

    return () => {
      cancelled = true;
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, [status, payload?.nodes.length, applyLayout, router]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || status !== "ready" || !payload?.nodes.length) return;
    applyLayout(cy, filteredModel);
  }, [filteredModel, applyLayout, status, payload?.nodes.length]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q || !payload) return;
    const match =
      payload.nodes.find((n) => n.title.toLowerCase() === q) ??
      payload.nodes.find((n) => n.title.toLowerCase().includes(q));
    if (!match) return;
    setFocusId(null);
    setSelectedId(match.id);
    window.setTimeout(() => {
      const cy = cyRef.current;
      if (!cy) return;
      const t = cy.getElementById(match.id);
      if (t.nonempty()) {
        cy.batch(() => {
          cy.elements().unselect();
          t.select();
        });
        cy.animate({ fit: { eles: t, padding: 80 }, duration: 200 });
      }
    }, 0);
  };

  const clearFocus = () => {
    setFocusId(null);
  };

  const focusNeighborhood = () => {
    if (!selectedId) return;
    setFocusId(selectedId);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading graph…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        {errorMessage ?? "Something went wrong."}
      </div>
    );
  }

  const noNotes = payload && payload.nodes.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end">
        <form onSubmit={onSearchSubmit} className="flex min-w-[12rem] flex-1 flex-col gap-1">
          <label htmlFor="note-graph-search" className="text-xs font-medium text-muted-foreground">
            Find note
          </label>
          <div className="flex gap-2">
            <input
              id="note-graph-search"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder="Title…"
              className="h-9 w-full min-w-0 rounded-md border bg-background px-3 text-sm"
            />
            <button
              type="submit"
              className="h-9 shrink-0 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              Go
            </button>
          </div>
        </form>

        <div className="flex min-w-[10rem] flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Min. link strength</span>
          <input
            type="range"
            min={1}
            max={weightMax}
            value={Math.min(minWeight, weightMax)}
            onChange={(ev) => setMinWeight(Number(ev.target.value))}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">
            Hide edges below weight {Math.min(minWeight, weightMax)} (max {weightMax})
          </span>
        </div>

        <div className="flex min-w-[10rem] flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Local depth (neighborhood)</span>
          <select
            value={focusDepth}
            onChange={(ev) => setFocusDepth(Number(ev.target.value))}
            disabled={!focusId}
            className="h-9 rounded-md border bg-background px-2 text-sm disabled:opacity-50"
          >
            <option value={1}>1 hop</option>
            <option value={2}>2 hops</option>
            <option value={3}>3 hops</option>
          </select>
          {!focusId ? (
            <span className="text-xs text-muted-foreground">
              Select a note, then use Focus neighborhood
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={focusNeighborhood}
            disabled={!selectedId}
            className="h-9 rounded-md border bg-background px-3 text-sm font-medium disabled:opacity-50"
          >
            Focus neighborhood
          </button>
          <button
            type="button"
            onClick={clearFocus}
            disabled={!focusId}
            className="h-9 rounded-md border bg-background px-3 text-sm font-medium disabled:opacity-50"
          >
            Show all notes
          </button>
          {selectedId ? (
            <Link
              href={`/notes/${selectedId}`}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              Open note
            </Link>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Click a note to select it (the graph stays put). Use Focus neighborhood to show only that note and nearby links.
        Double-click opens the editor. Dense libraries are easier to read on a wide screen.
      </p>

      {noNotes ? (
        <div className="flex h-[min(70vh,560px)] items-center justify-center rounded-xl border bg-background text-sm text-muted-foreground">
          No notes yet.{" "}
          <Link href="/notes/new" className="ml-1 underline">
            Create one
          </Link>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="h-[min(70vh,560px)] w-full rounded-xl border bg-background"
          aria-label="Notes graph"
        />
      )}
    </div>
  );
}
