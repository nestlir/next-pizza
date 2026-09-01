import { Container } from "@/shared/components/container";

export default function Home() {
  return (
    <main>
      <Container>
        <section className="py-10">
          <h1 className="text-4xl font-bold">
            Next Pizza 🍕
          </h1>

          <p className="mt-3 text-lg">
            Современный интернет-магазин пиццы на Next.js
          </p>
        </section>
      </Container>
    </main>
  );
}