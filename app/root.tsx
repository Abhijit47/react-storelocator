import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';
import { Toaster } from './components/ui/sonner';
import { StoreContextProvider } from './contexts/store-context';
import { cn } from './lib/utils';
import { themeSessionResolver } from './sessions.server';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

// Return the theme from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

// export function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang='en'>
//       <head>
//         <meta charSet='utf-8' />
//         <meta name='viewport' content='width=device-width, initial-scale=1' />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <StoreContextProvider>{children}</StoreContextProvider>
//         <ScrollRestoration />
//         <Scripts />
//         <Toaster />
//       </body>
//     </html>
//   );
// }

// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
  }, []);

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction='/action/set-theme'>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </ThemeProvider>
  );
}

// export function App() {
//   return <Outlet />;
// }

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang='en' className={cn(theme)} suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Toaster theme={theme ?? 'system'} richColors closeButton />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
