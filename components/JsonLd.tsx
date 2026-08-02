/**
 * JSON-LD Render Component
 *
 * Server Component for rendering application/ld+json script tags.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  pretty?: boolean;
}

function safeStringify(data: unknown, pretty = false): string {
  return JSON.stringify(data, null, pretty ? 2 : 0)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data, pretty = false }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeStringify(data, pretty) }}
    />
  );
}

export default JsonLd;
