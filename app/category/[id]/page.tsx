// Удаляем импорт generateMetadata или Metadata, если они есть

export default function CategoryPage({ params }: { params: { id: string } }) {
  // Код страницы...
  return <div>Category: {params.id}</div>
}
