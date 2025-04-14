import clsx from "clsx"; // opcional para combinar clases fácilmente
import "./PageContainer.css";

type PageContainerProps = {
  children: preact.ComponentChildren;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return <div class={clsx("page-container", className)}>{children}</div>;
}