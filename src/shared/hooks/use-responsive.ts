import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export function useResponsive(query: 'up' | 'down' | 'between', start: Breakpoint, end: Breakpoint = 'xl') {
  const theme = useTheme();

  const up = useMediaQuery(theme.breakpoints.up(start))
  const down = useMediaQuery(theme.breakpoints.down(start))
  const between = useMediaQuery(theme.breakpoints.between(start, end))
  const defaultSize =  useMediaQuery(theme.breakpoints.only(start));


  if (query === 'up') {
    return up
  }

  if (query === 'down') {
    return down
  }

  if (query === 'between' && end) {
    return between
  }

  return defaultSize
}

// ----------------------------------------------------------------------

export function useWidth() {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output: Breakpoint, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));

      return !output && matches ? key : output;
    }, 'xl') || 'xs'
  );
}
