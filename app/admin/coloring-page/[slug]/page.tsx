// Удаляем импорт generateMetadata или Metadata, если они есть

export default function ColoringPagePage({ params }: { params: { slug: string } }) {
  // Код страницы...
  return <div>Coloring Page: {params.slug}</div>
}
