import { useEffect, useState } from 'react';
import { Alert, Platform, Share, StyleSheet, View } from 'react-native';

import { FeelioButton } from '@/components/feelio/feelio-button';
import { ReportTableView } from '@/components/feelio/report-table';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';
import {
  buildSurveyTables,
  downloadTextFile,
  formatReportDate,
  surveyTablesToCsv,
  surveyTablesToHtml,
  type ReportTable,
  type SurveyExport,
} from '@/lib/survey-report';

export default function SurveyExportScreen() {
  const theme = useTheme();
  const { exportAllSurveyData } = useAppDataContext();
  const [payload, setPayload] = useState<SurveyExport | null>(null);
  const [tables, setTables] = useState<ReportTable[]>([]);

  useEffect(() => {
    exportAllSurveyData().then((data) => {
      setPayload(data);
      setTables(buildSurveyTables(data));
    });
  }, [exportAllSurveyData]);

  const shareHtml = async () => {
    if (!payload) return;
    const html = surveyTablesToHtml(payload, tables);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      downloadTextFile('feelio-survey-report.html', html, 'text/html;charset=utf-8');
      return;
    }
    await Share.share({
      title: 'Feelio survey report',
      message: 'Open this in a browser to see the tables.\n\n' + html,
    });
  };

  const shareSpreadsheet = async () => {
    if (!payload) return;
    const csv = `\uFEFF${surveyTablesToCsv(tables)}`;
    if (Platform.OS === 'web') {
      downloadTextFile('feelio-survey-report.csv', csv, 'text/csv;charset=utf-8');
      Alert.alert('Spreadsheet saved', 'Open the CSV file in Excel or Google Sheets.');
      return;
    }
    await Share.share({ message: csv, title: 'Feelio survey report' });
  };

  return (
    <ScreenContainer noTabInset>
      <View style={[styles.intro, { backgroundColor: theme.primaryLight }]}>
        <ThemedText type="smallBold">Readable survey report</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {payload
            ? `Prepared ${formatReportDate(payload.exportedAt)} · ${payload.participants.length} ${payload.participants.length === 1 ? 'person' : 'people'}`
            : 'Preparing tables…'}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Share the HTML file for a printed table view, or the spreadsheet for Excel.
        </ThemedText>
        <FeelioButton title="Share table report" onPress={shareHtml} disabled={!payload} />
        <FeelioButton title="Share spreadsheet (Excel)" variant="outline" onPress={shareSpreadsheet} disabled={!payload} />
      </View>

      {tables.map((table) => (
        <ReportTableView key={table.title} title={table.title} columns={table.columns} rows={table.rows} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    gap: Spacing.two,
  },
});
