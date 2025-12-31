export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the default dashboard padding for the editor
  // The editor manages its own full-bleed layout
  return <>{children}</>;
}
