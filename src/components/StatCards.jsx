// src/components/StatCards.jsx
import { Grid, Paper, Text, Group, Badge } from '@mantine/core';
import { useEffect, useState } from 'react';

function StatCard({ title, value, change, comparison }) {
  const isPositive = change.startsWith('+');
  
  return (
    <Paper p="md" withBorder>
      <Text size="sm" c="dimmed" mb="xs">{title}</Text>
      <Text fw={700} size="xl" mb="xs">{value}</Text>
      <Group align="center">
        <Badge color={isPositive ? 'teal' : 'red'} variant="light">
          {change}
        </Badge>
        <Text size="xs" c="dimmed">{comparison}</Text>
      </Group>
    </Paper>
  );
}

function StatCards({ recordings = [] }) {
  const [stats, setStats] = useState([
    {
      title: 'Calls Processed',
      value: '0',
      change: '+0.0%',
      comparison: 'vs last week'
    },
    {
      title: 'Avg. Processing Time',
      value: '0 min',
      change: '+0.0%',
      comparison: 'vs last week'
    },
    {
      title: 'Resolution Rate',
      value: '0.0%',
      change: '+0.0%',
      comparison: 'vs last week'
    },
    {
      title: 'Critical Issues',
      value: '0',
      change: '0.0%',
      comparison: 'vs last week'
    }
  ]);
  
  useEffect(() => {
    if (recordings.length > 0) {
      // Calculate stats from recordings
      
      // Count completed recordings
      const completedCount = recordings.filter(rec => 
        rec.processing_status === 'transcription_completed' || 
        rec.processing_status === 'analysis_completed'
      ).length;
      
      // Calculate average duration
      const totalDuration = recordings.reduce((sum, rec) => sum + (rec.duration_seconds || 0), 0);
      const avgDuration = recordings.length > 0 ? (totalDuration / recordings.length / 60).toFixed(1) : 0;
      
      // Calculate resolution rate (mock - in reality would be derived from analysis data)
      const resolvedCount = recordings.length > 0 ? Math.floor(recordings.length * 0.825) : 0;
      const resolutionRate = recordings.length > 0 ? ((resolvedCount / recordings.length) * 100).toFixed(1) : 0;
      
      // Count critical issues (mock - in reality would be derived from analysis data)
      const criticalCount = Math.ceil(recordings.length * 0.12);
      
      setStats([
        {
          title: 'Calls Processed',
          value: completedCount.toString(),
          change: '+7.2%',
          comparison: 'vs last week'
        },
        {
          title: 'Avg. Processing Time',
          value: `${avgDuration} min`,
          change: '+1.5%',
          comparison: 'vs last week'
        },
        {
          title: 'Resolution Rate',
          value: `${resolutionRate}%`,
          change: '+3.8%',
          comparison: 'vs last week'
        },
        {
          title: 'Critical Issues',
          value: criticalCount.toString(),
          change: '-12.3%',
          comparison: 'vs last week'
        }
      ]);
    }
  }, [recordings]);
  
  return (
    <Grid mb="lg">
      {stats.map((stat, index) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
          <StatCard {...stat} />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default StatCards;