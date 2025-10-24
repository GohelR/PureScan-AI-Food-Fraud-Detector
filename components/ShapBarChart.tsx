
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { FeatureInfluence } from '../types';

interface ShapBarChartProps {
  features: FeatureInfluence[];
}

const CustomizedLabel: React.FC<any> = (props) => {
    const { x, y, width, value } = props;
    const isPositive = value > 0;
    const labelX = isPositive ? x + width + 5 : x - 5;
    const textAnchor = isPositive ? 'start' : 'end';
    
    return (
        <text x={labelX} y={y + 12} fill="#334155" textAnchor={textAnchor} fontSize={12} fontWeight="bold">
            {value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2)}
        </text>
    );
};


export const ShapBarChart: React.FC<ShapBarChartProps> = ({ features }) => {
  const sortedFeatures = [...features].sort((a, b) => a.influence - b.influence);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedFeatures}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={['auto', 'auto']} tickFormatter={(tick) => tick.toFixed(2)} />
        <YAxis 
            dataKey="feature" 
            type="category" 
            width={120} 
            tick={{ fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }}
          formatter={(value: number, name, props) => [`Influence: ${value > 0 ? '+' : ''}${value.toFixed(2)}`, null]}
          labelFormatter={(label) => <span className="font-bold">{label}</span>}
        />
        <Bar dataKey="influence" radius={[4, 4, 4, 4]}>
          {sortedFeatures.map((entry, index) => (
            <rect
              key={`cell-${index}`}
              fill={entry.influence > 0 ? '#ef4444' : '#22c55e'}
            />
          ))}
          <LabelList dataKey="influence" content={<CustomizedLabel />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
