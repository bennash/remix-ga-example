import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect } from "react";

import * as gtag from "~/utils/gtags.client";
/**
 * @description
 * If you would like to include the development env values in your browser bundle AKA
 * set some global values on the window object, take a look at these docs here:
 * https://remix.run/docs/en/v1/guides/envvars#server-environment-variables
 */
// export async function loader() {
//   return json({
//     ENV: {
//       APP_ENV: process.env.NODE_ENV,
//     },
//   });
// }

type LoaderData = {
  gaTrackingId: string | undefined;
};

// Load the GA tracking id from the .env
export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ gaTrackingId: process.env.GA_TRACKING_ID });
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Google Analytics Remix Integration Example",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const location = useLocation();
  const { gaTrackingId } = useLoaderData<LoaderData>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        {!gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <h1>Remix Integration with Google Analytics</h1>
        <nav style={{ display: "flex", gap: "10px" }}>
          <a href="/">Home</a>
          <a href="/page-1">Page 1</a>
          <a href="/page-2">Page 2</a>
          <a href="/page-3">Page 3</a>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
