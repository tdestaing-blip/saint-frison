import type { ComponentProps } from "react";

// Native navigation also works when the hosting adapter cannot initialize
// its client router. Keep these public links independent of RSC prefetching.
export default function SiteLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
