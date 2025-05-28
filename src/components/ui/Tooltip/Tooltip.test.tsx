import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '.';

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: 'Hover me' }).parentElement;
    expect(trigger).toBeInTheDocument();

    if (trigger) {
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });
    }
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: 'Hover me' }).parentElement;
    expect(trigger).toBeInTheDocument();

    if (trigger) {
      // Show tooltip
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Hide tooltip
      await user.unhover(trigger);
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    }
  });

  it('does not show tooltip when disabled', async () => {
    render(
      <Tooltip content="Tooltip content" disabled={true}>
        <button>Hover me</button>
      </Tooltip>
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: 'Hover me' }).parentElement;
    expect(trigger).toBeInTheDocument();

    if (trigger) {
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    }
  });

  it('applies different positions correctly', async () => {
    const { rerender } = render(
      <Tooltip content="Tooltip content" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('button', { name: 'Hover me' }).parentElement;
    expect(trigger).toBeInTheDocument();

    if (trigger) {
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveClass('tooltip__bottom');
      });
    }

    rerender(
      <Tooltip content="Tooltip content" position="right">
        <button>Hover me</button>
      </Tooltip>
    );

    if (trigger) {
      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveClass('tooltip__right');
      });
    }
  });
});
