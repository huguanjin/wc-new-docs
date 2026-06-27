import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

const STORAGE_KEY = 'api-ref-column-widths';

const DEFAULTS = {sidebar: 260, panel: 440} as const;
const LIMITS = {
  sidebar: {min: 200, max: 420},
  panel: {min: 300, max: 720},
} as const;

type LayoutWidths = {sidebar: number; panel: number};

type LayoutCssVars = CSSProperties & {
  '--api-sidebar-w'?: string;
  '--api-panel-w'?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readStored(): LayoutWidths | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LayoutWidths>;
    if (
      typeof parsed.sidebar === 'number' &&
      typeof parsed.panel === 'number' &&
      Number.isFinite(parsed.sidebar) &&
      Number.isFinite(parsed.panel)
    ) {
      return {
        sidebar: clamp(parsed.sidebar, LIMITS.sidebar.min, LIMITS.sidebar.max),
        panel: clamp(parsed.panel, LIMITS.panel.min, LIMITS.panel.max),
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function useApiRefLayout(): {
  sidebarWidth: number;
  panelWidth: number;
  layoutStyle: LayoutCssVars;
  resetSidebarWidth: () => void;
  resetPanelWidth: () => void;
  onResizeSidebar: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onResizePanel: (e: ReactPointerEvent<HTMLDivElement>) => void;
} {
  const [widths, setWidths] = useState<LayoutWidths>(() => readStored() ?? {...DEFAULTS});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
    } catch {
      /* ignore quota / private mode */
    }
  }, [widths]);

  const layoutStyle: LayoutCssVars = {
    '--api-sidebar-w': `${widths.sidebar}px`,
    '--api-panel-w': `${widths.panel}px`,
  };

  const resetSidebarWidth = useCallback(() => {
    setWidths(prev => ({...prev, sidebar: DEFAULTS.sidebar}));
  }, []);

  const resetPanelWidth = useCallback(() => {
    setWidths(prev => ({...prev, panel: DEFAULTS.panel}));
  }, []);

  const bindResize = useCallback(
    (target: 'sidebar' | 'panel', startEvent: ReactPointerEvent<HTMLDivElement>) => {
      if (typeof window === 'undefined') return;
      if (!window.matchMedia('(min-width: 1101px)').matches) return;

      startEvent.preventDefault();
      const startX = startEvent.clientX;
      const start = {...widths};
      const el = startEvent.currentTarget;
      el.setPointerCapture(startEvent.pointerId);

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        setWidths(prev => {
          if (target === 'sidebar') {
            return {
              ...prev,
              sidebar: clamp(
                start.sidebar + dx,
                LIMITS.sidebar.min,
                LIMITS.sidebar.max,
              ),
            };
          }
          return {
            ...prev,
            panel: clamp(start.panel - dx, LIMITS.panel.min, LIMITS.panel.max),
          };
        });
      };

      const onEnd = () => {
        el.releasePointerCapture(startEvent.pointerId);
        document.body.classList.remove('api-ref-resizing');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onEnd);
        window.removeEventListener('pointercancel', onEnd);
      };

      document.body.classList.add('api-ref-resizing');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onEnd);
      window.addEventListener('pointercancel', onEnd);
    },
    [widths],
  );

  const onResizeSidebar = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => bindResize('sidebar', e),
    [bindResize],
  );

  const onResizePanel = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => bindResize('panel', e),
    [bindResize],
  );

  return {
    sidebarWidth: widths.sidebar,
    panelWidth: widths.panel,
    layoutStyle,
    resetSidebarWidth,
    resetPanelWidth,
    onResizeSidebar,
    onResizePanel,
  };
}
