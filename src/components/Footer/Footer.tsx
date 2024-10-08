import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white rounded-lg ">
      <div className="w-[95%] max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse "
          >
            <Image
              src="/parsylllogotrans.png"
              alt="Parsyll Logo"
              width={44}
              height={44}
            />
            <span className="self-center  whitespace-nowrap text-lg md:text-xl text-gray-800 font-semibold">
              PDF2Cal
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-600 sm:mb-0">
            <li>
              <Link
                href="https://www.pdf2calendar.com/about/"
                className="transition-all transform active:scale-[0.98] hover:scale-[1.01] mr-4"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="https://www.pdf2calendar.com/private-policy/"
                className="transition-all transform active:scale-[0.98] hover:scale-[1.01] mr-4"
              >
                Privacy Policy
              </Link>
            </li>

            <li>
              <a
                href="#"
                className="transition-all transform active:scale-[0.98] hover:scale-[1.01]"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-400 sm:mx-auto  lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center ">
          © 2024{" "}
          <a
            href="/"
            className="transition-all transform active:scale-[0.98] hover:scale-[1.01]"
          >
            PDF2CAL
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
