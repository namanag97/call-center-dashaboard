import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Sector,
  Label,
} from 'recharts';
import { twMerge } from 'tailwind-merge';

export type ChartType = 'line' | 'bar' | 'pie';

export interface DataPoint {
  name: string;
  value: number;
  [key: string]: any; // Allow for additional properties
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color?: string;
}

export interface ChartComponentProps {
  /**
   * Type of chart to display
   */
  type: ChartType;

  /**
   * Data for the chart
   */
  data: DataPoint[];

  /**
   * Series configurations for line and bar charts
   */
  series?: ChartSeries[];

  /**
   * Width of the chart container (default: 100%)
   */
  width?: number | string;

  /**
   * Height of the chart container (default: 300px)
   */
  height?: number | string;

  /**
   * Title for the chart
   */
  title?: string;

  /**
   * Label for x-axis (not applicable for pie charts)
   */
  xAxisLabel?: string;

  /**
   * Label for y-axis (not applicable for pie charts)
   */
  yAxisLabel?: string;

  /**
   * Show grid lines (default: true, not applicable for pie charts)
   */
  showGrid?: boolean;

  /**
   * Show legend (default: true)
   */
  showLegend?: boolean;

  /**
   * Show tooltips on hover (default: true)
   */
  showTooltip?: boolean;

  /**
   * Custom color palette
   */
  colors?: string[];

  /**
   * Whether the chart is in a loading state
   */
  isLoading?: boolean;

  /**
   * Custom CSS class names
   */
  className?: string;
}

const defaultColors = [
  '#6366f1', // primary-500
  '#14b8a6', // secondary-500
  '#22c55e', // success-500
  '#f59e0b', // warning-500
  '#ef4444', // error-500
  '#3b82f6', // info-500
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
];

/**
 * ChartComponent for data visualization
 */
const ChartComponent: React.FC<ChartComponentProps> = ({
  type = 'line',
  data = [],
  series = [{ name: 'Value', dataKey: 'value', color: defaultColors[0] }],
  width = '100%',
  height = 300,
  title,
  xAxisLabel,
  yAxisLabel,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  colors = defaultColors,
  isLoading = false,
  className = '',
}) => {
  // Handle empty data state
  if (data.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center border rounded-md bg-white text-neutral-500 h-[300px]">
        No data available
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center border rounded-md bg-white h-[300px]">
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  // Ensure each series has a color from the palette if not specified
  const seriesWithColors = series.map((s, index) => ({
    ...s,
    color: s.color || colors[index % colors.length],
  }));

  // Calculate pie data for single series
  const pieData = type === 'pie' ? data.map(item => ({
    name: item.name,
    value: typeof item[series[0]?.dataKey || 'value'] === 'number' 
      ? item[series[0]?.dataKey || 'value'] 
      : 0,
  })) : [];

  // Custom active shape for pie chart
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <text x={cx} y={cy} dy={-15} textAnchor="middle" fill="#333" fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#333" fontSize={14}>
          {`${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  // State for active pie sector
  const [activePieIndex, setActivePieIndex] = React.useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActivePieIndex(index);
  };

  // Custom tooltip formatter
  const valueFormatter = (value: number) => {
    return value.toLocaleString();
  };

  // Render the appropriate chart type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
            >
              {xAxisLabel && <Label value={xAxisLabel} position="insideBottom" offset={-5} />}
            </XAxis>
            <YAxis 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
            >
              {yAxisLabel && <Label value={yAxisLabel} angle={-90} position="insideLeft" />}
            </YAxis>
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {seriesWithColors.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
            >
              {xAxisLabel && <Label value={xAxisLabel} position="insideBottom" offset={-5} />}
            </XAxis>
            <YAxis 
              tick={{ fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
            >
              {yAxisLabel && <Label value={yAxisLabel} angle={-90} position="insideLeft" />}
            </YAxis>
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {seriesWithColors.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color}
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              activeIndex={activePieIndex}
              activeShape={renderActiveShape}
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {pieData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        // Return empty LineChart as a fallback
        return (
          <LineChart data={[]}>
            <XAxis dataKey="name" />
            <YAxis />
          </LineChart>
        );
    }
  };

  return (
    <div className={twMerge('bg-white rounded-lg border border-neutral-200 p-4', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        </div>
      )}
      <ResponsiveContainer width={width} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent; 