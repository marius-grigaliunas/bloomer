import React from 'react';

// Performance monitoring utility for calendar generation
interface PerformanceMetrics {
  calendarGenerationTime: number;
  cacheHitRate: number;
  cacheMisses: number;
  cacheHits: number;
  renderTime: number;
  interactionTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    calendarGenerationTime: 0,
    cacheHitRate: 0,
    cacheMisses: 0,
    cacheHits: 0,
    renderTime: 0,
    interactionTime: 0
  };

  private timers: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer ${name} was not started`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    // Update relevant metrics
    if (name === 'calendarGeneration') {
      this.metrics.calendarGenerationTime = duration;
    } else if (name === 'render') {
      this.metrics.renderTime = duration;
    } else if (name === 'interaction') {
      this.metrics.interactionTime = duration;
    }
    
    return duration;
  }

  updateCacheMetrics(hits: number, misses: number): void {
    this.metrics.cacheHits = hits;
    this.metrics.cacheMisses = misses;
    const total = hits + misses;
    this.metrics.cacheHitRate = total > 0 ? (hits / total) * 100 : 0;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  logMetrics(): void {
    console.log('🎯 Performance Metrics:', {
      'Calendar Generation (ms)': this.metrics.calendarGenerationTime.toFixed(2),
      'Render Time (ms)': this.metrics.renderTime.toFixed(2),
      'Interaction Time (ms)': this.metrics.interactionTime.toFixed(2),
      'Cache Hit Rate (%)': this.metrics.cacheHitRate.toFixed(1),
      'Cache Hits': this.metrics.cacheHits,
      'Cache Misses': this.metrics.cacheMisses
    });
  }

  reset(): void {
    this.metrics = {
      calendarGenerationTime: 0,
      cacheHitRate: 0,
      cacheMisses: 0,
      cacheHits: 0,
      renderTime: 0,
      interactionTime: 0
    };
    this.timers.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const startTimer = (name: string) => performanceMonitor.startTimer(name);
  const endTimer = (name: string) => performanceMonitor.endTimer(name);
  const logMetrics = () => performanceMonitor.logMetrics();
  const getMetrics = () => performanceMonitor.getMetrics();
  const reset = () => performanceMonitor.reset();

  return {
    startTimer,
    endTimer,
    logMetrics,
    getMetrics,
    reset
  };
};

// Higher-order component for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { startTimer, endTimer } = usePerformanceMonitor();

    React.useEffect(() => {
      startTimer(`${componentName}-render`);
      return () => {
        endTimer(`${componentName}-render`);
      };
    });

    return <Component {...props} ref={ref} />;
  });
};
