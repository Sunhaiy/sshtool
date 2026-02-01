import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-500 bg-red-900/20 border border-red-900 rounded">
          <h3 className="font-bold">Error in {this.props.name || 'Component'}</h3>
          <pre className="text-xs mt-2 whitespace-pre-wrap">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
