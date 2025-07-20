export default function Navigation() {
  return (
    <header className="w-full bg-gray-100 py-4 shadow">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <div className="text-xl font-bold">TreatU DK</div>
        <ul className="flex space-x-6">
          <li>
            <a href="#" className="hover:text-blue-600">Hjem</a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">Om os</a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">Kontakt</a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">Tilmeld dig</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
