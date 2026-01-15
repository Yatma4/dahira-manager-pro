import { useMembers } from '@/contexts/MemberContext';
import { MOIS } from '@/types/member';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ContributionChart() {
  const { contributions } = useMembers();
  const currentYear = new Date().getFullYear();

  const monthlyData = MOIS.map((mois, index) => {
    const monthContributions = contributions.filter(
      c => c.mois === index + 1 && c.annee === currentYear
    );
    const total = monthContributions.reduce((sum, c) => sum + c.montant, 0);
    
    return {
      name: mois.substring(0, 3),
      montant: total,
    };
  });

  return (
    <div className="card-elevated p-6">
      <h3 className="font-serif font-bold text-lg mb-4">Cotisations {currentYear}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Montant']}
            />
            <Bar 
              dataKey="montant" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
