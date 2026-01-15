import { useMembers } from '@/contexts/MemberContext';
import { SECTIONS } from '@/types/member';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  'hsl(199, 89%, 48%)',
  'hsl(43, 96%, 56%)',
  'hsl(142, 70%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(199, 85%, 65%)',
  'hsl(0, 84%, 60%)',
  'hsl(199, 90%, 38%)',
  'hsl(43, 95%, 70%)',
];

export function SectionStats() {
  const { members } = useMembers();

  const sectionData = SECTIONS.map((section, index) => ({
    name: section,
    value: members.filter(m => m.section === section).length,
    color: COLORS[index % COLORS.length],
  })).filter(s => s.value > 0);

  if (sectionData.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="font-serif font-bold text-lg mb-4">Répartition par Section</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <h3 className="font-serif font-bold text-lg mb-4">Répartition par Section</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectionData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {sectionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} membres`, '']}
            />
            <Legend 
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
