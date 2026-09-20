
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { trackPixelPageView } from "../lib/meta-pixel";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { RainProvider } from "../components/RainProvider";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SmoothScrollProvider } from "../components/SmoothScroll";
import { CartProvider } from "../context/CartContext";
import { PreloaderProvider } from "../context/PreloaderContext";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { WhatsAppFloatingButton } from "../components/WhatsAppFloatingButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Detectives Zone — Story-Driven Investigation Cases" },
      {
        name: "description",
        content:
          "Detectives Zone is a cinematic, story-driven investigation experience. Examine evidence, connect clues and uncover the truth hidden in the shadows.",
      },
      { name: "author", content: "Detectives Zone" },
      { property: "og:title", content: "Detectives Zone — Story-Driven Investigation Cases" },
      {
        property: "og:description",
        content: "Examine the evidence. Connect the unconnected. Uncover what others never saw.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preload", href: "https://api.detectiveszone.com/uploads/hero/df33b893238b_detective-poster.webp", as: "image", type: "image/webp" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Special+Elite&family=Courier+Prime:wght@400;700&family=Caveat:wght@400;500;600;700&family=Share+Tech+Mono&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        src: "https://checkout.razorpay.com/v1/checkout.js",
        async: true,
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2533539463718226');
fbq('track', 'PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2533539463718226&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const currentPath = pathname + (routerState.location.searchStr || "");
  const isAdminRoute = pathname.startsWith("/admin");
  const showWhatsAppButton = !isAdminRoute;

  // Track Meta Pixel PageView on client-side route changes without duplicate firing on initial load
  const prevPathRef = useRef(currentPath);
  useEffect(() => {
    // Only fire on client-side navigation when the path actually changes
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      trackPixelPageView();
    }
  }, [currentPath]);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <CartProvider>
          <SmoothScrollProvider>
            <RainProvider>
              <PreloaderProvider>
                {!isAdminRoute && <Navbar />}
                <main className="min-h-screen">
                  <Outlet />
                </main>
                {!isAdminRoute && <Footer />}
                {showWhatsAppButton && <WhatsAppFloatingButton position="bottom-left" />}
              </PreloaderProvider>
            </RainProvider>
          </SmoothScrollProvider>
        </CartProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
