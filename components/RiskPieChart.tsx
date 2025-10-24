
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RiskPieChartProps {
  fraudProbability: number;
}

const COLORS = {
  Safe: '#22c55e',
  Fraudulent: '#ef4444',
};

export const RiskPieChart: React.FC<RiskPieChartProps> = ({ fraudProbability }) => {
  const safeProbability = 1 - fraudProbability;
  const data = [
    { name: 'Safe Probability', value: safeProbability },
    { name: 'Fraudulent Probability', value: fraudProbability },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            return (
              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          <Cell key={`cell-safe`} fill={COLORS.Safe} />
          <Cell key={`cell-fraudulent`} fill={COLORS.Fraudulent} />
        </Pie>
        <Tooltip 
           formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
        />
        <Legend 
            formatter={(value) => <span className="text-slate-600">{value.replace(' Probability', '')}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
