import React, { ErrorInfo } from "react";

export interface Props {
   fallbackComponent?: React.ReactNode;
   children: React.ReactNode;
}

export interface State {
   hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {

   constructor(props: Props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error: any) {
      return { hasError: true };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.log(error, errorInfo);
   }

   render() {

      if (this.state.hasError)
         return this.props.fallbackComponent ?? <h1>Something went wrong.</h1>;

      return this.props.children;
   }
}