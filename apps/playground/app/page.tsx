import { Button } from '@websmith/ui'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Websmith Kit Playground</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="flex gap-4 flex-wrap">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>








      </div>
    </main>
  )
}