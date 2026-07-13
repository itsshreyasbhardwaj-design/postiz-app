'use client';

import { FC, useMemo } from 'react';
import { TotalList } from '@gitroom/frontend/components/analytics/stars.and.forks.interface';
import { chunk } from 'lodash';
import {
  AreaChart,
  Area,
  Grid,
  ChartTooltip,
} from '@gitroom/frontend/components/ui/charts';

function mergeDataPoints(data: TotalList[], numPoints: number): TotalList[] {
  const res = chunk(data, Math.ceil(data.length / numPoints));
  return res.map((row) => {
    return {
      date: `${row[0].date} - ${row?.at(-1)?.date}`,
      total: row.reduce((acc, curr) => acc + curr.total, 0),
    };
  });
}

const colorSchemes = {
  purple: { fill: '#612bd3' },
  green: { fill: '#32d583' },
  blue: { fill: '#1d9bf0' },
} as const;

// Redesigned with Bklit UI (bklit.com) — a composable, animated area-chart
// primitive built on @visx — replacing the previous chart.js implementation.
export const ChartSocial: FC<{
  data: TotalList[];
  color?: keyof typeof colorSchemes;
}> = (props) => {
  const { data, color = 'purple' } = props;

  const list = useMemo(() => {
    const merged = data.length < 7 ? data : mergeDataPoints(data, 7);
    if (merged.length === 1) {
      // duplicate single datapoint metrics so the chart still renders a line
      return [merged[0], merged[0]];
    }
    return merged;
  }, [data]);

  const { fill } = colorSchemes[color];

  const chartData = useMemo(
    () => list.map((row) => ({ date: row.date, total: row.total })),
    [list]
  );

  return (
    <AreaChart
      data={chartData}
      xDataKey="date"
      margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
      animationDuration={750}
      className="w-full h-full"
    >
      <Area dataKey="total" fill={fill} fillOpacity={0.35} strokeWidth={2} />
      <Grid horizontal={false} vertical={false} />
      <ChartTooltip />
    </AreaChart>
  );
};
