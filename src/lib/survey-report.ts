import { EMOTIONS } from '@/constants/data';
import type { Badge, JournalEntry, MoodEntry, PulseEntry, WellnessGoal } from '@/types';

export type SurveyExportParticipant = {
  id: string;
  label: string;
  createdAt: string;
  moods: MoodEntry[];
  journal: JournalEntry[];
  pulseHistory: PulseEntry[];
  goals: WellnessGoal[];
  badges: Badge[];
  anonymousMode: boolean;
};

export type SurveyExport = {
  exportedAt: string;
  participants: SurveyExportParticipant[];
};

export type ReportTable = {
  title: string;
  columns: string[];
  rows: string[][];
};

const EMPTY = '—';

export function emotionLabel(id: string) {
  const emotion = EMOTIONS.find((item) => item.id === id);
  return emotion ? `${emotion.emoji} ${emotion.label}` : id;
}

export function formatReportDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function list(values: string[]) {
  return values.length ? values.join(', ') : EMPTY;
}

function yesNo(value: boolean) {
  return value ? 'Yes' : 'No';
}

export function buildSurveyTables(payload: SurveyExport): ReportTable[] {
  const overview: ReportTable = {
    title: 'People in this survey',
    columns: ['Person', 'Profile started', 'Pulses', 'Moods', 'Journal entries', 'Goals finished', 'Badges earned'],
    rows: payload.participants.map((person) => [
      person.label,
      formatReportDate(person.createdAt),
      String(person.pulseHistory.length),
      String(person.moods.length),
      String(person.journal.length),
      String(person.goals.filter((g) => g.totalCompletions > 0).length),
      String(person.badges.filter((b) => b.earned).length),
    ]),
  };

  const pulses: ReportTable = {
    title: 'Daily pulse check-ins',
    columns: ['Person', 'When', 'Feeling', 'What was affecting them', 'What they said would help'],
    rows: payload.participants.flatMap((person) =>
      person.pulseHistory.map((entry) => [
        person.label,
        formatReportDate(entry.date),
        emotionLabel(entry.feeling),
        list(entry.affecting),
        list(entry.help),
      ]),
    ),
  };

  const moods: ReportTable = {
    title: 'Mood check-ins',
    columns: ['Person', 'When', 'Mood', 'Triggers', 'Note'],
    rows: payload.participants.flatMap((person) =>
      person.moods.map((entry) => [
        person.label,
        formatReportDate(entry.date),
        emotionLabel(entry.emotionId),
        list(entry.triggers),
        entry.note?.trim() || EMPTY,
      ]),
    ),
  };

  const journal: ReportTable = {
    title: 'Journal entries',
    columns: ['Person', 'When', 'Prompt', 'What they wrote'],
    rows: payload.participants.flatMap((person) =>
      person.journal.map((entry) => [
        person.label,
        formatReportDate(entry.date),
        entry.prompt,
        entry.content.trim() || EMPTY,
      ]),
    ),
  };

  const goals: ReportTable = {
    title: 'Wellness goals',
    columns: ['Person', 'Goal', 'Done today', 'Current streak', 'Times completed'],
    rows: payload.participants.flatMap((person) =>
      person.goals.map((goal) => [
        person.label,
        `${goal.emoji} ${goal.title}`,
        yesNo(goal.completedToday),
        String(goal.streak),
        String(goal.totalCompletions),
      ]),
    ),
  };

  const badges: ReportTable = {
    title: 'Badges earned',
    columns: ['Person', 'Badge', 'Earned', 'When earned'],
    rows: payload.participants.flatMap((person) =>
      person.badges.map((badge) => [
        person.label,
        `${badge.emoji} ${badge.title}`,
        yesNo(badge.earned),
        badge.earnedDate ? formatReportDate(badge.earnedDate) : EMPTY,
      ]),
    ),
  };

  return [overview, pulses, moods, journal, goals, badges];
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function surveyTablesToCsv(tables: ReportTable[]) {
  return tables
    .map((table) => {
      const header = table.columns.map(escapeCsv).join(',');
      const body = table.rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
      const title = escapeCsv(table.title);
      return `${title}\n${header}\n${body || escapeCsv('No data yet')}`;
    })
    .join('\n\n');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function surveyTablesToHtml(payload: SurveyExport, tables: ReportTable[]) {
  const exported = formatReportDate(payload.exportedAt);
  const sections = tables
    .map((table) => {
      const head = table.columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('');
      const body =
        table.rows.length === 0
          ? `<tr><td colspan="${table.columns.length}">No data yet</td></tr>`
          : table.rows
              .map(
                (row) =>
                  `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`,
              )
              .join('');
      return `<section><h2>${escapeHtml(table.title)}</h2><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Feelio survey report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1A1625; background: #FAF8FF; margin: 24px; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    .meta { color: #6B6580; margin-bottom: 28px; }
    h2 { font-size: 18px; color: #7C6BF0; margin: 28px 0 8px; }
    table { border-collapse: collapse; width: 100%; background: #fff; margin-bottom: 8px; }
    th, td { border: 1px solid #E8E4F0; padding: 10px 12px; text-align: left; vertical-align: top; font-size: 14px; }
    th { background: #EDE9FE; color: #1A1625; font-weight: 700; }
    tr:nth-child(even) td { background: #FAF8FF; }
    @media print { body { background: #fff; margin: 12px; } }
  </style>
</head>
<body>
  <h1>Feelio survey report</h1>
  <p class="meta">Prepared ${escapeHtml(exported)} · ${payload.participants.length} ${payload.participants.length === 1 ? 'person' : 'people'}</p>
  ${sections}
</body>
</html>`;
}

export function downloadTextFile(filename: string, contents: string, mimeType: string) {
  if (typeof document === 'undefined') return false;
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
