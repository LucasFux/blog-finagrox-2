export function Newsletter() {
  return (
    <section className="bg-brand-green-light py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-white mb-4 text-balance">
            Recibí semanalmente un resumen del sector agropecuario argentino.
          </h2>

          <div className="mt-8 flex justify-center">
            <iframe
              src="https://finagrox.substack.com/embed"
              width="640"
              height="220"
              style={{ border: "1px solid #EEE", background: "white" }}
              frameBorder="0"
              scrolling="no"
              title="Suscripción a Finagrox"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
