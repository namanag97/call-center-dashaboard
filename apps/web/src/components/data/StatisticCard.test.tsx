import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatisticCard from './StatisticCard';

describe('StatisticCard', () => {
  it('renders basic card with title and value', () => {
    render(<StatisticCard title="Total Calls" value="1,254" />);
    
    expect(screen.getByText('Total Calls')).toBeInTheDocument();
    expect(screen.getByText('1,254')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <StatisticCard 
        title="Total Calls" 
        value="1,254" 
        description="Since last month" 
      />
    );
    
    expect(screen.getByText('Since last month')).toBeInTheDocument();
  });

  it('renders positive change percentage with up arrow', () => {
    render(
      <StatisticCard 
        title="Average Score" 
        value="87.5" 
        changePercentage={12.4} 
      />
    );
    
    const percentageElement = screen.getByText('+12.4%');
    expect(percentageElement).toBeInTheDocument();
    expect(percentageElement.parentElement).toHaveClass('text-success-600');
  });

  it('renders negative change percentage with down arrow', () => {
    render(
      <StatisticCard 
        title="Failed Calls" 
        value="24" 
        changePercentage={-8.5} 
      />
    );
    
    const percentageElement = screen.getByText('-8.5%');
    expect(percentageElement).toBeInTheDocument();
    expect(percentageElement.parentElement).toHaveClass('text-error-600');
  });

  it('renders progress bar when progress is provided', () => {
    render(
      <StatisticCard 
        title="Completion Rate" 
        value="68%" 
        progress={68} 
      />
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '68');
  });

  it('renders footer content when provided', () => {
    render(
      <StatisticCard 
        title="Unreviewed Calls" 
        value="38" 
        footer={<span data-testid="footer-content">Updated 5m ago</span>}
      />
    );
    
    expect(screen.getByTestId('footer-content')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(
      <StatisticCard 
        title="Click Me" 
        value="42" 
        onClick={handleClick} 
      />
    );
    
    await user.click(screen.getByText('42'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies different styles based on type prop', () => {
    const { rerender } = render(
      <StatisticCard 
        title="Success Card" 
        value="100" 
        type="success" 
        icon={<span data-testid="icon" />} 
      />
    );
    
    const successIcon = screen.getByTestId('icon').parentElement;
    expect(successIcon).toHaveClass('bg-success-100', 'text-success-600');
    
    rerender(
      <StatisticCard 
        title="Error Card" 
        value="100" 
        type="error" 
        icon={<span data-testid="icon" />} 
      />
    );
    
    const errorIcon = screen.getByTestId('icon').parentElement;
    expect(errorIcon).toHaveClass('bg-error-100', 'text-error-600');
  });

  it('applies different styles based on size prop', () => {
    const { rerender } = render(
      <StatisticCard 
        title="Small Card" 
        value="100" 
        size="sm" 
      />
    );
    
    const smallValue = screen.getByText('100');
    expect(smallValue).toHaveClass('text-lg');
    
    rerender(
      <StatisticCard 
        title="Large Card" 
        value="100" 
        size="lg" 
      />
    );
    
    const largeValue = screen.getByText('100');
    expect(largeValue).toHaveClass('text-3xl');
  });
}); 