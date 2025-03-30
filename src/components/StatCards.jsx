// src/components/StatCards.jsx
import { Grid, Paper, Text, Group, Badge } from '@mantine/core';

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

function StatCards() {
  const stats = [
    {
      title: 'Calls Processed',
      value: '1,247',
      change: '+7.2%',
      comparison: 'vs last week'
    },
    {
      title: 'Avg. Processing Time',
      value: '3.4 min',
      change: '+1.5%',
      comparison: 'vs last week'
    },
    {
      title: 'Resolution Rate',
      value: '82.5%',
      change: '+3.8%',
      comparison: 'vs last week'
    },
    {
      title: 'Critical Issues',
      value: '17',
      change: '-12.3%',
      comparison: 'vs last week'
    }
  ];
  
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