export default function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  // Код страницы...
  return <div>Product: {params.slug}</div>
}
