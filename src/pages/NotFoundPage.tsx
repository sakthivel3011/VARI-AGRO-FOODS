import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const NotFoundPage = () => {
  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">404</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-[#2b1f14]">Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[#5d554c]">
          The page you requested is not available. Let us guide you back to our premium rice collection.
        </p>
        <Link to="/" className="mt-7 inline-block">
          <Button>Go To Home</Button>
        </Link>
      </Container>
    </section>
  );
};

export default NotFoundPage;
