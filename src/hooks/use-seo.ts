import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
  path: string;
  image?: string;
}

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/** Sets per-route title, meta description, canonical, and OG/Twitter tags. */
export const useSEO = ({ title, description, path, image = "https://getgrover.ai/img/og.png" }: SEOOptions) => {
  useEffect(() => {
    const url = `https://getgrover.ai${path}`;
    document.title = title;
    setCanonical(url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:image", image);
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
  }, [title, description, path, image]);
};
