import { ReactNode, useEffect } from "react";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";

interface MetaTags {
  title: string;
  description: string;
}

interface LandingLayoutProps {
  meta: MetaTags;
  children: ReactNode;
}

const LandingLayout = ({ meta, children }: LandingLayoutProps) => {
  // Update document meta tags on mount
  useEffect(() => {
    // Update title
    document.title = meta.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', meta.description);

    // Update OG tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', meta.title);
    updateOgTag('og:description', meta.description);
  }, [meta.title, meta.description]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{
        contain: 'layout',
        isolation: 'isolate',
      }}
    >
      <LandingHeader />
      <main className="flex-1" style={{ contain: 'content' }}>
        {children}
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
