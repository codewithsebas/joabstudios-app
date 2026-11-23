type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue | undefined }

/** Renders schema.org structured data. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: { [key: string]: JsonValue | undefined } }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
