import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import React, { Suspense } from "react";
import CenteredCircularProgress from "./centeredCircularProgress";
import { ErrorBoundary } from "./errorBoundary";
import theme from "./theme";

export interface Props {
   children: React.ReactNode;
}

export default function ThemeContainer(props: Props) {
   return (
      <StyledEngineProvider injectFirst>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<CenteredCircularProgress />}>
               <ErrorBoundary>
                  {props.children}
               </ErrorBoundary>
            </Suspense>
         </ThemeProvider>
      </StyledEngineProvider>
   );
}