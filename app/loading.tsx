import Loader from "../components/Loader";

export default function loading() {
  return (
    <Loader
      className="fixed inset-0 flex justify-center items-center"
      size="lg"
    />
  );
}
